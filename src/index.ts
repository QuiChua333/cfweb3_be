import { NestFactory } from '@nestjs/core';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { loadGuards } from './app.guard';
import { loadMiddlewares } from './app.middleware';

export const initApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('api');

  loadMiddlewares(app);

  loadGuards(app);

  return app;
};
