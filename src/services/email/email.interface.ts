import { Campaign } from '@/entities';

export interface IEMailObject {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface ISendMailResetPassword {
  resetPasswordToken: string;
  email: string;
}

export interface ISendMailVerifyEmail {
  verifyEmailToken: string;
  email: string;
}

export interface ISendInvitationEmail {
  email: string;
  campaign: Campaign;
  invitationToken: string;
}
