import { Global, Module } from '@nestjs/common';
import { PinataService } from './pinata.service';

@Global()
@Module({
  providers: [PinataService],
  exports: [PinataService],
})
export class PinataModule {}
