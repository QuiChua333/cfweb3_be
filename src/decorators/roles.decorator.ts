import { Role, ROLES_KEY } from '@/constants';
import { SetMetadata } from '@nestjs/common';

export function Roles(roles: Role[]) {
  return SetMetadata(ROLES_KEY, roles);
}
