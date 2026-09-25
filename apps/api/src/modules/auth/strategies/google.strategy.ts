import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID', '');
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET', '');
    const callbackURL = configService.get<string>(
      'GOOGLE_CALLBACK_URL',
      'http://localhost:3000/api/v1/auth/google/callback',
    );

    const isConfigured = !!clientID && !!clientSecret;

    super({
      clientID: clientID || 'not-configured',
      clientSecret: clientSecret || 'not-configured',
      callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });

    if (!clientID || !clientSecret) {
      this.logger.warn('⚠️ Google OAuth credentials not configured — Google login will not work');
    }
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, emails, displayName, photos } = profile;

    // Extract role from the state parameter (passed during OAuth initiation)
    const role = req.query?.state || 'CREATOR';

    const googleUser = {
      googleId: id,
      email: emails?.[0]?.value,
      fullName: displayName,
      avatarUrl: photos?.[0]?.value,
      role,
    };

    done(null, googleUser);
  }
}
