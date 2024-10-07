import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/api/auth/dto';
import { UserService } from 'src/api/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/constants';
import { ITokenPayload } from '@/api/auth/auth.interface';
import { envs } from '@/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findOneById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied');

    const isRefreshTokenMatched = await argon2.verify(user.refreshToken, refreshToken);

    if (!isRefreshTokenMatched) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens({
      id: user.id,
      email: user.email,
      role: user.isAdmin ? Role.Admin : Role.User,
    });

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    return this.userService.update(userId, {
      refreshToken: null,
    });
  }

  async validateJwtUser(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Wrong credentials provided');
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!(user && user.password === password)) {
      throw new BadRequestException('Wrong credentials provided');
    }

    return user;
  }

  private async hashData(data: string) {
    return argon2.hash(data);
  }

  private async getTokens(payload: ITokenPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: envs.jwtAccessSecret,
        expiresIn: envs.jwtExpiredAccess,
      }),
      this.jwtService.signAsync(payload, {
        secret: envs.jwtRefreshSecret,
        expiresIn: envs.jwtExpiredRefresh,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
