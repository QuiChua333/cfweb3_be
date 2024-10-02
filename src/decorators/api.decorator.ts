import { Role } from '@/constants';
import { Public } from '@/decorators/public.decorator';
import { Roles } from '@/decorators/roles.decorator';
import {
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  RequestMethod,
  applyDecorators,
  Patch,
} from '@nestjs/common';

export interface IRouteParams {
  path: string;
  code?: number;
  method: number;
  jwtSecure?: boolean;
  roles?: Role[];
  jwtRefresh?: boolean;
}

export function InjectRoute({
  path = '/',
  jwtSecure = true,
  code = HttpStatus.OK,
  method = RequestMethod.GET,
  jwtRefresh = false,
  roles = null,
}: IRouteParams) {
  const methodDecorator = {
    [RequestMethod.GET]: Get,
    [RequestMethod.PATCH]: Patch,
    [RequestMethod.POST]: Post,
    [RequestMethod.DELETE]: Delete,
  };

  const decorators = [methodDecorator[method](path), HttpCode(code)];

  if (!jwtSecure) {
    decorators.push(Public());
  }

  if (jwtRefresh) {
    decorators.push();
  }

  if (roles) {
    decorators.push(Roles(roles));
  }

  return applyDecorators(...decorators);
}
