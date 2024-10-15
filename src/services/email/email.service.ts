import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IEMailObject } from './email.interface';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(mailObject: IEMailObject) {
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
