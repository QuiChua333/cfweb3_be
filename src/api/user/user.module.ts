import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [CloudinaryModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
