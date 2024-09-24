import { ValidatorException } from '@/exceptions';
import { CustomFilterExceptionFilter } from '@/filters';
import { ValidationPipe, type INestApplication } from '@nestjs/common';

export const loadMiddlewares = (app: INestApplication): void => {
  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new ValidatorException(errors),
    }),
  );
  app.useGlobalFilters(new CustomFilterExceptionFilter());
};
