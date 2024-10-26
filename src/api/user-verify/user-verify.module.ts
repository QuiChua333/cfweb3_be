import { Module } from '@nestjs/common';
import { UserVerifyService } from './user-verify.service';
import { UserVerifyController } from './user-verify.controller';

@Module({
  controllers: [UserVerifyController],
  providers: [UserVerifyService],
})
export class UserVerifyModule {}
