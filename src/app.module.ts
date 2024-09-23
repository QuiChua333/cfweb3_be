import { AppController } from '@/app.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [AppModule, AuthModule, UserModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
