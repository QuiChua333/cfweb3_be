import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role, ROLES_KEY } from 'src/constants';
import { ITokenPayload } from '../auth.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) return true;
    const request = context.switchToHttp().getRequest();
    const user: ITokenPayload = request.user;
    const isValidRole = roles.includes(user.role);
    if (!isValidRole) throw new ForbiddenException('Forbidden resource');
    return true;
  }
}
