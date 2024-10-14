import { envs } from '@/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(envs.db)],
})
export class DatabaseModule {}
