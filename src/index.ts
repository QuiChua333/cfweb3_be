import { NestFactory } from '@nestjs/core';
import { type INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { loadGuards } from './app.guard';
import { loadMiddlewares } from './app.middleware';
import { Web3Service } from './services/web3/web3.service';

export const initApplication = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.setGlobalPrefix('api');

  loadMiddlewares(app);

  loadGuards(app);

  const web3Service = app.get<Web3Service>(Web3Service);
  web3Service.watchContractEvent();

  return app;
};
