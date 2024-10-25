import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/auth/auth.module';
import { UserModule } from '@/api/user/user.module';
import { AppController } from '@/app.controller';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './services/email/email.module';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [DatabaseModule, RepositoryModule, AuthModule, UserModule, EmailModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
