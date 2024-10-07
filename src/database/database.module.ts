import { envs } from '@/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: envs.typeormHost,
      port: envs.typeormPort,
      username: envs.typeormUsername,
      password: envs.typeormPassword,
      database: envs.typeormDatabase,
      // entities: [`${__dirname}/../api/**/*.entity.{js,ts}`],
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
