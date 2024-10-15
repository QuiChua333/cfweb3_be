import { Body, Controller, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthRoute from '@/api/auth/auth.routes';
import { InjectRoute, User } from '@/decorators';
import { ForgotPasswordDto, LoginDto, RegisterDto } from '@/api/auth/dto';
import { ITokenPayload } from './auth.interface';
import { envs } from '@/config';

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
}
