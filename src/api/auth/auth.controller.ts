import { Body, Controller, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthRoute from '@/api/auth/auth.routes';
import { InjectRoute, User } from '@/decorators';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordBaseOldPasswordDto,
} from '@/api/auth/dto';
import { ITokenPayload } from './auth.interface';
import { envs } from '@/config';
import { Request } from 'express';

@Controller(AuthRoute.root)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @InjectRoute(AuthRoute.register)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @InjectRoute(AuthRoute.login)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @InjectRoute(AuthRoute.logout)
  logout(@User() user: ITokenPayload) {
    this.authService.logout(user.id);
  }

  @InjectRoute(AuthRoute.refreshToken)
  refreshToken(@User() user: ITokenPayload) {
    return this.authService.refreshTokens(user);
  }

  @InjectRoute(AuthRoute.googleLogin)
  googleLogin() {}

  @InjectRoute(AuthRoute.googleCallback)
  async googleCallback(@User() user: ITokenPayload, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.loginAfterGoogleCallback(user);
    res.redirect(`${envs.fe.homeUrl}?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }

  @InjectRoute(AuthRoute.forgotPassword)
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @InjectRoute(AuthRoute.resetPassword)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @InjectRoute(AuthRoute.resendEmailConfirm)
  async resendEmailConfirm(@User() user: ITokenPayload) {
    return this.authService.sendEmailConfirm(user);
  }

  @InjectRoute(AuthRoute.confirmEmail)
  async confirmEmail(@Query('token') token: string, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.confirmEmail(token);

    //redirect to fe verify email success
    res.redirect(`${envs.fe.emailVerifySuccessUrl}`);
  }

  @InjectRoute(AuthRoute.updatePasswordBaseOldPassword)
  updatePasswordBaseOldPassword(
    @User() user: ITokenPayload,
    @Body() updatePasswordBaseOldPassword: UpdatePasswordBaseOldPasswordDto,
  ) {
    return this.authService.updatePasswordBaseOldPassword(user, updatePasswordBaseOldPassword);
  }
}
