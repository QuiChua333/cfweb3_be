import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ValidatorException } from 'src/exceptions';

@Catch()
export class CustomFilterExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    try {
      if (exception instanceof ValidatorException) {
        const { status, message, details } = exception.getResponse();
        response.status(status).send({
          status,
          message,
          details,
        });
      } else if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const message = exception.message;
        response.status(status).send({
          status,
          message,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Server Error (filter)',
      });
    }
  }
}
