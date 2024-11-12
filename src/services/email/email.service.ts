import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import {
  IEMailObject,
  ISendInvitationEmail,
  ISendMailResetPassword,
  ISendMailVerifyEmail,
} from './email.interface';
import { envs } from '@/config';
import { resetPasswordTemplate, verifyEmailTemplate } from './templates';
import invitationTeamTemplate from './templates/invitation-team.template';
import activeTemplate from './templates/activate.template';
import inactiveTemplate from './templates/inactive.template';
import fundingTemplate from './templates/funding.template';
import terminateTemplate from './templates/terminate.template';
import refundingTemplate from './templates/refunding.template';
import { Contribution } from '@/entities';
import contributionSuccessHasPerksTemplate from './templates/contribution-success-has-perks.template';
import contributionSuccessNoPerksTemplate from './templates/contribution-success-no-perks.template';

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

  async sendFundingEmail({ email, campaignTitle }: { email: string; campaignTitle: string }) {
    const html = fundingTemplate({ campaignTitle });

    return this.sendMail({
      email,
      subject: 'ĐĂNG TẢI THÀNH CÔNG',
      html,
    });
  }

  async sendReFundingEmail({ email, campaignTitle }: { email: string; campaignTitle: string }) {
    const html = refundingTemplate({ campaignTitle });

    return this.sendMail({
      email,
      subject: 'KÍCH HOẠT LẠI CHIẾN DỊCH THÀNH CÔNG',
      html,
    });
  }

  async sendTerminateEmail({ email, campaignTitle }: { email: string; campaignTitle: string }) {
    const html = terminateTemplate({ campaignTitle });

    return this.sendMail({
      email,
      subject: 'TẠM NGỪNG CHIẾN DỊCH',
      html,
    });
  }

  async sendActivateEmail({ email }: { email: string }) {
    const html = activeTemplate();

    return this.sendMail({
      email,
      subject: 'KÍCH HOẠT TÀI KHOẢN',
      html,
    });
  }

  async sendInActivateEmail({ email }: { email: string }) {
    const html = inactiveTemplate();

    return this.sendMail({
      email,
      subject: 'KHÓA TÀI KHOẢN',
      html,
    });
  }

  async sendContributionSuccessHasPerk(contribution: Contribution) {
    const html = contributionSuccessHasPerksTemplate(contribution);
    return this.sendMail({
      email: contribution.email,
      subject: 'ĐÓNG GÓP CHIẾN DỊCH THÀNH CÔNG',
      html,
    });
  }

  async sendContributionSuccessNoPerk(contribution: Contribution) {
    const html = contributionSuccessNoPerksTemplate(contribution);
    return this.sendMail({
      email: contribution.email,
      subject: 'ĐÓNG GÓP CHIẾN DỊCH THÀNH CÔNG',
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

  async sendInvitationTeamLink({ email, invitationToken, campaign }: ISendInvitationEmail) {
    const url = `${envs.be.beUrl}/team-member/confirm?token=${invitationToken}`;
    const html = invitationTeamTemplate({
      campaignTitle: campaign.title,
      ownerName: campaign.owner.fullName,
      linkEditCampaign: url,
    });

    return this.sendMail({
      email,
      subject: 'MỜI THAM GIA CHIẾN DỊCH',
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
