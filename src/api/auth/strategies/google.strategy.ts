import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { envs } from '@/config';
import { ITokenPayload } from '../auth.interface';
import { Role } from '@/constants';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: envs.google.clientId,
      clientSecret: envs.google.clientSecret,
      callbackURL: envs.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      fullName: `${profile.name.givenName} ${profile.name.familyName}`,
      avatar: profile.photos[0].value,
      password: '',
    });
    return {
      id: user.id,
      email: user.email,
      role: Role.User,
    } as ITokenPayload;
  }
}
