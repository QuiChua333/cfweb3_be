import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { loadGuards } from './app.guard';
import { loadMiddlewares } from './app.middleware';

export const initApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  loadMiddlewares(app);

  loadGuards(app);

  return app;
};
