import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@/config';
import { UserModule } from '@/api/user/user.module';
import { JwtStrategy, RefreshTokenStrategy } from '@/api/auth/strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: envs.jwtAccessSecret,
      signOptions: { expiresIn: envs.jwtExpiredAccess },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
