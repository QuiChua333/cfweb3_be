import {
  Get,
  Put,
  Post,
  Delete,
  HttpCode,
  UseGuards,
  HttpStatus,
  SetMetadata,
  RequestMethod,
  applyDecorators,
} from '@nestjs/common';

import type { CustomDecorator } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '@/constants';
import { JwtAuthGuard } from '@/api/auth/guards';

export interface IRouteParams {
  path: string;
  code?: number;
  method: number;
  jwtSecure?: boolean;
}

function Public(): CustomDecorator<string> {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

export function InjectRoute({
  path = '/',
  jwtSecure = true,
  code = HttpStatus.OK,
  method = RequestMethod.GET,
}: IRouteParams) {
  const methodDecorator = {
    [RequestMethod.GET]: Get,
    [RequestMethod.PUT]: Put,
    [RequestMethod.POST]: Post,
    [RequestMethod.DELETE]: Delete,
  };

  const decorators = [methodDecorator[method](path), HttpCode(code)];

  if (!jwtSecure) {
    decorators.push(Public());
  } else {
    decorators.push(UseGuards(JwtAuthGuard));
  }

  return applyDecorators(...decorators);
}
