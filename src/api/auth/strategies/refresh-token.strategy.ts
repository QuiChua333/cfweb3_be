import { envs } from '@/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICurrentUser, ITokenPayload } from 'src/api/auth/auth.interface';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envs.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: ITokenPayload) {
    const refreshToken = req.headers.authorization.replace('Bearer', '').trim();
    return {
      ...payload,
      refreshToken,
    } as ICurrentUser;
  }
}
