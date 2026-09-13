import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto';
import { UserRole, UserStatus, JwtPayload, UserResponse } from '@2becollab/types';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { TokenType } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {
    this.accessTokenExpiry = this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m');
    this.refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRY', '7d');
    this.accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET', 'default-dev-secret');
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET', 'default-dev-refresh-secret');
  }

  // ─── REGISTER ───────────────────────────────────────────────

  async register(dto: RegisterDto): Promise<{ user: UserResponse; message: string }> {
    // Block admin/support registration
    if (dto.role !== 'CREATOR' && dto.role !== 'BUSINESS') {
      throw new ForbiddenException('Invalid role for registration');
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        fullName: dto.fullName,
        role: dto.role as UserRole,
        status: UserStatus.REGISTERED,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        type: TokenType.EMAIL_VERIFICATION,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Send verification email
    await this.emailService.sendVerificationEmail(user.email, verificationToken, user.fullName);

    this.logger.log(`📝 New user registered: ${user.email} (${user.role})`);

    return {
      user: this.toUserResponse(user),
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  // ─── LOGIN ──────────────────────────────────────────────────

  async login(dto: LoginDto): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check password
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check account status
    if (user.status === 'SUSPENDED') {
      throw new ForbiddenException('Your account has been suspended');
    }

    if (user.status === 'DELETED') {
      throw new UnauthorizedException('Account not found');
    }

    // Check email verification
    if (!user.emailVerifiedAt && user.status === 'REGISTERED') {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role as UserRole);

    this.logger.log(`🔑 User logged in: ${user.email}`);

    return {
      user: this.toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  // ─── LOGOUT ─────────────────────────────────────────────────

  async logout(refreshToken: string): Promise<void> {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
  }

  // ─── REFRESH TOKENS ────────────────────────────────────────

  async refreshTokens(
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Find the token in DB
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check expiry
    if (storedToken.expiresAt < new Date()) {
      // Clean up expired token
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Delete old token (rotation)
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Generate new token pair
    const { accessToken, refreshToken } = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role as UserRole,
    );

    return { accessToken, refreshToken };
  }

  // ─── VERIFY EMAIL ──────────────────────────────────────────

  async verifyEmail(token: string): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    // Mark token as used and update user status
    await this.prisma.$transaction([
      this.prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: {
          status: UserStatus.ACTIVE,
          emailVerifiedAt: new Date(),
        },
      }),
    ]);

    // Auto-login the user after verification
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: verificationToken.userId },
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      updatedUser!.id,
      updatedUser!.email,
      updatedUser!.role as UserRole,
    );

    this.logger.log(`✅ Email verified: ${updatedUser!.email}`);

    return {
      user: this.toUserResponse(updatedUser!),
      accessToken,
      refreshToken,
    };
  }

  // ─── RESEND VERIFICATION ──────────────────────────────────

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If this email is registered, a verification link has been sent.' };
    }

    if (user.emailVerifiedAt) {
      return { message: 'Email is already verified.' };
    }

    // Invalidate old tokens
    await this.prisma.verificationToken.updateMany({
      where: {
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    // Create new token
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await this.emailService.sendVerificationEmail(user.email, token, user.fullName);

    return { message: 'If this email is registered, a verification link has been sent.' };
  }

  // ─── FORGOT PASSWORD ──────────────────────────────────────

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return same message (don't reveal if user exists)
    const message = 'If this email is registered, a password reset link has been sent.';

    if (!user) {
      return { message };
    }

    // Invalidate old reset tokens
    await this.prisma.verificationToken.updateMany({
      where: {
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });

    // Create new reset token
    const token = crypto.randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        token,
        type: TokenType.PASSWORD_RESET,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await this.emailService.sendPasswordResetEmail(user.email, token);

    this.logger.log(`🔒 Password reset requested for: ${user.email}`);

    return { message };
  }

  // ─── RESET PASSWORD ───────────────────────────────────────

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token: dto.token,
        type: TokenType.PASSWORD_RESET,
        usedAt: null,
      },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.prisma.$transaction([
      this.prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: { passwordHash },
      }),
      // Invalidate all refresh tokens (force re-login)
      this.prisma.refreshToken.deleteMany({
        where: { userId: verificationToken.userId },
      }),
    ]);

    this.logger.log(`🔒 Password reset completed for user: ${verificationToken.userId}`);

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }

  // ─── GOOGLE AUTH ──────────────────────────────────────────

  async handleGoogleAuth(googleUser: {
    googleId: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    role: string;
  }): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    // Check if user exists by Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      // Check if user exists by email (might have registered with email/password first)
      user = await this.prisma.user.findUnique({
        where: { email: googleUser.email.toLowerCase() },
      });

      if (user) {
        // Link Google account to existing user
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleUser.googleId,
            avatarUrl: user.avatarUrl || googleUser.avatarUrl,
            emailVerifiedAt: user.emailVerifiedAt || new Date(),
            status: user.status === 'REGISTERED' ? UserStatus.ACTIVE : user.status,
          },
        });
      } else {
        // Validate role
        const role = ['CREATOR', 'BUSINESS'].includes(googleUser.role) ? googleUser.role : 'CREATOR';

        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: googleUser.email.toLowerCase(),
            fullName: googleUser.fullName,
            googleId: googleUser.googleId,
            avatarUrl: googleUser.avatarUrl,
            role: role as UserRole,
            status: UserStatus.ACTIVE,
            emailVerifiedAt: new Date(), // Google emails are pre-verified
          },
        });

        this.logger.log(`📝 New Google user: ${user.email} (${user.role})`);
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role as UserRole,
    );

    return {
      user: this.toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  // ─── GET CURRENT USER ─────────────────────────────────────

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toUserResponse(user);
  }

  // ─── HELPERS ──────────────────────────────────────────────

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessTokenExpiry as any,
    });

    const refreshToken = crypto.randomBytes(40).toString('hex');

    // Parse refresh token expiry to ms
    const expiryMs = this.parseExpiryToMs(this.refreshTokenExpiry);

    // Store refresh token in DB
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + expiryMs),
      },
    });

    return { accessToken, refreshToken };
  }

  private parseExpiryToMs(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days

    const value = parseInt(match[1]!, 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  private toUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() || null,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
