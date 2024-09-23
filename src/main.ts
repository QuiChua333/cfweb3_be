import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { envs } from '@/config';
import { AppModule } from '@/app.module';
import { loadMiddlewares } from '@/app.middleware';
import { loadGuards } from '@/app.guard';

async function bootstrap() {
  const logger = new Logger('APP');
  const app = await NestFactory.create(AppModule);

  loadMiddlewares(app);

  loadGuards(app);

  await app.listen(envs.port);

  logger.log(`APP is running on port ${envs.port}`);
}
bootstrap();
