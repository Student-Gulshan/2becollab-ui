import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    // Set tokens as HttpOnly cookies
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refresh_token'];
    await this.authService.logout(refreshToken);

    // Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies?.['refresh_token'] || req.body?.refreshToken;
    const result = await this.authService.refreshTokens(oldRefreshToken);

    // Set new cookies
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    return { accessToken: result.accessToken };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyEmail(dto.token);

    // Auto-login: set cookies
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerification(body.email);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') userId: string) {
    const user = await this.authService.getMe(userId);
    return { user };
  }

  // ─── GOOGLE OAUTH ──────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redirects to Google — this method body is never reached
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = req.user as any;
    const result = await this.authService.handleGoogleAuth(googleUser);

    // Set tokens as cookies
    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    // Redirect to frontend
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:5173');
    res.redirect(`${appUrl}/auth/callback?success=true`);
  }

  // ─── HELPER ────────────────────────────────────────────────

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/v1/auth', // Only sent to auth endpoints
    });
  }
}
