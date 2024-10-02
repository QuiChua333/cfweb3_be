import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@/config';
import { UserModule } from '@/api/user/user.module';
import { JwtStrategy } from '@/api/auth/strategies';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
