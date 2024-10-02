import { HttpStatus } from '@nestjs/common';

export interface IBaseExceptionResponse {
  status: HttpStatus;
  message: string;
}
