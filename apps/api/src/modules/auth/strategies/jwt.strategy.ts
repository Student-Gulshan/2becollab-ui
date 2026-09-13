import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '@2becollab/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First try to extract from cookie
        (req: Request) => {
          return req?.cookies?.['access_token'] || null;
        },
        // Fallback to Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET', 'default-dev-secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        emailVerifiedAt: true,
        avatarUrl: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status === 'SUSPENDED' || user.status === 'DELETED') {
      throw new UnauthorizedException('Account is suspended or deleted');
    }

    return user;
  }
}
