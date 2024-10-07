import { ICurrentUser, ITokenPayload } from '@/api/auth/auth.interface';
import { envs } from '@/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/api/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtAccessSecret,
    });
  }

  async validate(payload: ITokenPayload) {
    const { email } = payload;
    await this.authService.validateJwtUser(email);
    return payload as ICurrentUser;
  }
}
