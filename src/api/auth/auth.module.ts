import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@/config';
import { UserModule } from '@/api/user/user.module';
import { GoogleStrategy, JwtStrategy, RefreshTokenStrategy } from '@/api/auth/strategies';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [
    PassportModule,
    EmailModule,
    UserModule,
    JwtModule.register({
      secret: envs.jwt.accessSecret,
      signOptions: { expiresIn: envs.jwt.expiredAccess },
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
