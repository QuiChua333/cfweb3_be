import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IEMailObject, ISendMailResetPassword, ISendMailVerifyEmail } from './email.interface';
import { envs } from '@/config';
import { resetPasswordTemplate, verifyEmailTemplate } from './templates';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyEmailLink({ email, verifyEmailToken }: ISendMailVerifyEmail) {
    const url = `${envs.be.emailConfirmUrl}?token=${verifyEmailToken}`;
    console.log(url);
    const html = verifyEmailTemplate(url);

    return this.sendMail({
      email,
      subject: 'XÁC MINH EMAIL',
      html,
    });
  }

  async sendResetPasswordLink({ email, resetPasswordToken }: ISendMailResetPassword) {
    const url = `${envs.fe.emailResetPasswordUrl}?token=${resetPasswordToken}`;
    const html = resetPasswordTemplate(url);

    return this.sendMail({
      email,
      subject: 'CẬP NHẬT MẬT KHẨU',
      html,
    });
  }

  private async sendMail(mailObject: IEMailObject) {
    const { email, subject, text, html } = mailObject;

    if (html) {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        html: html,
      });
    } else {
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        text: text,
      });
    }
  }
}
