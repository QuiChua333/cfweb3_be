import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { envs } from '@/config';

@Module({
  imports: [MailerModule.forRoot(envs.email)],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
