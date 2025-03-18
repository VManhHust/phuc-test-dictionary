import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
      private configService: ConfigService,
      private authService: AuthService,
  ) {
    const facebookAppId = configService.get<string>('FACEBOOK_APP_ID');
    const facebookAppSecret = configService.get<string>('FACEBOOK_APP_SECRET');

    if (!facebookAppId || !facebookAppSecret) {
      throw new Error('Facebook app ID or secret is not set in the configuration');
    }

    super({
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      callbackURL: `${configService.get<string>('API_URL')}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails'],
      scope: ['email'],
    });
  }

  async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: Function,
  ) {
    try {
      const user = await this.authService.findOrCreateUserFromOAuth(profile, 'facebook');
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}