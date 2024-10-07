import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  handleRequest<ICurrentUser>(err: any, user: any): ICurrentUser {
    if (err) throw err;
    if (!user) throw new UnauthorizedException('Invalid or expired token');

    return user;
  }
}
