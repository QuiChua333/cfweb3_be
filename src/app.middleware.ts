import { ValidatorException } from '@/exceptions';
import { CustomFilterExceptionFilter } from '@/filters';
import * as bodyParser from 'body-parser';
import { ValidationPipe, type INestApplication } from '@nestjs/common';

export const loadMiddlewares = (app: INestApplication): void => {
  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => new ValidatorException(errors),
    }),
  );
  app.useGlobalFilters(new CustomFilterExceptionFilter());

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
};
