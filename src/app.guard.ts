import { Reflector } from '@nestjs/core';

import type { INestApplication } from '@nestjs/common';

import { JwtAuthGuard, RoleGuard } from '@/api/auth/guards';

export const loadGuards = (app: INestApplication): void => {
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RoleGuard(reflector));
};
