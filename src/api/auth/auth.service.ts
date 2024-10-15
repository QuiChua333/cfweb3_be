import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/api/auth/dto';
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
    if (existedUser) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(registerDto.password);
    const newUser = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens({
      id: newUser.id,
      email: newUser.email,
      role: Role.User,
    });

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async login(loginDtoo: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDtoo.email);

    if (!user) {
      throw new BadRequestException('Email or password is invalid');
    }

    const isMatchedPassword = await argon2.verify(user.password, loginDtoo.password);

    if (!isMatchedPassword) {
      throw new BadRequestException('Email or password is invalid');
    }

    const tokens = await this.getTokens({
      id: user.id,
      email: loginDtoo.email,
      role: user.isAdmin ? Role.Admin : Role.User,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);

    if (!user || !user.refreshToken) throw new ForbiddenException('Invalid refresh token');
    const isRefreshTokenMatched = await argon2.verify(user.refreshToken, refreshToken);

    if (!isRefreshTokenMatched) throw new ForbiddenException('Invalid refresh token');
  }

  async logout(userId: string) {
    return this.userService.update(userId, {
      refreshToken: null,
    });
  }

  async refreshTokens(tokenPayload: ITokenPayload) {
    const tokens = await this.getTokens(tokenPayload);

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

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
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

  async validateJwtUser(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) throw new BadRequestException('Invalid access token');
    return user;
  }

  private async hashData(data: string) {
    return argon2.hash(data);
  }
}
