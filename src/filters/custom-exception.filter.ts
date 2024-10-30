import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Response } from 'express';
import {
  IBaseExceptionResponse,
  IvalidatorExceptionResponse,
  ValidatorException,
} from 'src/exceptions';

@Catch()
export class CustomFilterExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let baseExceptionResponse: IBaseExceptionResponse = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
    };

    try {
      if (exception instanceof ValidatorException) {
        const validtaionExceptionResponse: IvalidatorExceptionResponse = exception.getResponse();

        response.status(validtaionExceptionResponse.status).send(validtaionExceptionResponse);
      } else if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const message = exception.message;
        baseExceptionResponse = { status, message };

        response.status(status).send(baseExceptionResponse);
      } else if (exception instanceof TokenExpiredError) {
        baseExceptionResponse.status = HttpStatus.UNAUTHORIZED;
        baseExceptionResponse.message = 'Token has expired';
        response.status(baseExceptionResponse.status).send(baseExceptionResponse);
      } else if (exception instanceof JsonWebTokenError) {
        baseExceptionResponse.status = HttpStatus.UNAUTHORIZED;
        baseExceptionResponse.message = 'Invalid token';
        response.status(baseExceptionResponse.status).send(baseExceptionResponse);
      } else {
        console.log('filter', { exception });
        baseExceptionResponse.message = 'Server Error (Exception?)';
        response.status(baseExceptionResponse.status).send(baseExceptionResponse);
      }
    } catch (error) {
      console.log('filter', { error });
      baseExceptionResponse.message = 'Server Error (filter)';

      return response.status(baseExceptionResponse.status).send(baseExceptionResponse);
    }
  }
}
