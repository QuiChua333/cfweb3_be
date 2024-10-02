import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { IBaseExceptionResponse } from 'src/exceptions/base.exception';

interface IFieldValidationError {
  field: string;
  errors: string[];
}
export interface IvalidatorExceptionResponse extends IBaseExceptionResponse {
  details: IFieldValidationError[];
}
export class ValidatorException extends BadRequestException {
  constructor(protected errors: ValidationError[]) {
    super();
  }

  getResponse() {
    const formattedErrors = this.errors.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));
    return {
      status: this.getStatus(),
      message: 'Invalid information',
      details: formattedErrors,
    } as IvalidatorExceptionResponse;
  }
}
