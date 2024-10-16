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
