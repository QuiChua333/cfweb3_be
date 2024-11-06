import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  UpdatePasswordBaseOldPasswordDto,
} from 'src/api/auth/dto';
import { UserService } from 'src/api/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/constants';
import { ITokenPayload } from '@/api/auth/auth.interface';
import { envs } from '@/config';
import { EmailService } from '@/services/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existedUser = await this.userService.findOneByEmail(registerDto.email);
    if (existedUser) throw new BadRequestException('Tài khoản đã tồn tại');

    const hashedPassword = await this.hashData(registerDto.password);
    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = <ITokenPayload>{
      email: newUser.email,
      id: newUser.id,
      role: Role.User,
    };

    return this.sendEmailConfirm(payload);
  }

  async login(loginDtoo: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDtoo.email);

    if (!user) {
      throw new BadRequestException('Sai tài khoản hoặc mật khẩu');
    }

    const isMatchedPassword = await argon2.verify(user.password, loginDtoo.password);

    if (!isMatchedPassword) {
      throw new BadRequestException('Sai tài khoản hoặc mật khẩu');
    }

    const tokens = await this.getTokens({
      id: user.id,
      email: loginDtoo.email,
      role: user.isAdmin ? Role.Admin : Role.User,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      isAdmin: user.isAdmin,
    };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user.refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const isRefreshTokenMatched = await argon2.verify(user.refreshToken, refreshToken);

    if (!isRefreshTokenMatched) throw new UnauthorizedException('Invalid refresh token');
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null);
  }

  async refreshTokens(tokenPayload: ITokenPayload) {
    const payload: ITokenPayload = {
      email: tokenPayload.email,
      id: tokenPayload.id,
      role: tokenPayload.role,
    };
    const tokens = await this.getTokens(payload);

    await this.updateRefreshToken(tokenPayload.id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    const payload = <ITokenPayload>{
      email: user.email,
      id: user.id,
      role: Role.User,
    };

    const resetPasswordToken = await this.getTokenLink(payload);

    return this.emailService.sendResetPasswordLink({ email, resetPasswordToken });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const payload = await this.verifyTokenLink(resetPasswordDto.token);
    const user = await this.userService.findOneById(payload.id);

    if (!user) throw new BadRequestException('Invalid reset password token');

    const hashedPassword = await this.hashData(resetPasswordDto.password);
    return this.userService.updatePassword(user.id, hashedPassword);
  }

  private async getTokens(payload: ITokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: envs.jwt.accessSecret,
        expiresIn: envs.jwt.expiredAccess,
      }),
      this.jwtService.signAsync(payload, {
        secret: envs.jwt.refreshSecret,
        expiresIn: envs.jwt.expiredRefresh,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async getTokenLink(payload: ITokenPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: envs.jwt.linkSecret,
      expiresIn: envs.jwt.expiredLink,
    });
  }

  private async verifyTokenLink(token: string): Promise<ITokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envs.jwt.linkSecret,
    });
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!(user && user.password === password)) {
      throw new BadRequestException('Wrong credentials provided');
    }

    return user;
  }

  async validateGoogleUser(googleUser: RegisterDto) {
    const user = await this.userService.findOneByEmail(googleUser.email);

    if (user) return user;

    return await this.userService.create(googleUser, true);
  }

  async loginAfterGoogleCallback(user: ITokenPayload) {
    const tokens = await this.getTokens(user);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async sendEmailConfirm(payload: ITokenPayload) {
    const verifyEmailToken = await this.getTokenLink(payload);
    return this.emailService.sendVerifyEmailLink({ email: payload.email, verifyEmailToken });
  }

  async confirmEmail(token: string) {
    const payload = await this.verifyTokenLink(token);
    const user = await this.userService.findOneById(payload.id);

    if (!user) throw new BadRequestException('Invalid verify email token');

    if (user.isVerifiedEmail) throw new BadRequestException('Email already confirmed');

    await this.userService.updateVerifiedEmail(user.id);

    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
      role: Role.User,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updatePasswordBaseOldPassword(
    user: ITokenPayload,
    updatePasswordBaseOldPassword: UpdatePasswordBaseOldPasswordDto,
  ) {
    const currentUser = await this.userService.findOneById(user.id);
    const isMatchedOldPassword = await this.compareData(
      currentUser.password,
      updatePasswordBaseOldPassword.currentPassword,
    );
    if (!isMatchedOldPassword) throw new BadRequestException('Mật khẩu hiện tại không đúng');
    const hashedPassword = await this.hashData(updatePasswordBaseOldPassword.newPassword);
    return this.userService.updatePassword(user.id, hashedPassword);
  }
  async validateJwtUser(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Invalid access token');

    return user;
  }

  private async hashData(data: string) {
    return argon2.hash(data);
  }

  private async compareData(hashedText, plainText) {
    return await argon2.verify(hashedText, plainText);
  }
}
