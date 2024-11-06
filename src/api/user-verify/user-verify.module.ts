import { Module } from '@nestjs/common';
import { UserVerifyService } from './user-verify.service';
import { UserVerifyController } from './user-verify.controller';
import { UserModule } from '../user/user.module';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({
  imports: [UserModule, CloudinaryModule],
  controllers: [UserVerifyController],
  providers: [UserVerifyService],
})
export class UserVerifyModule {}
