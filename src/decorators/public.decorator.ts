import { IS_PUBLIC_KEY } from '@/constants';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
