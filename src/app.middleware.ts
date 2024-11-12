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

  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use(
    bodyParser.json({
      limit: '10mb',
      verify: (req, res, buf) => {
        if (req.headers['stripe-signature']) {
          req['rawBody'] = buf.toString();
        }
      },
    }),
  );
};
