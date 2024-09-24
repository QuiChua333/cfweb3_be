import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidatorException extends BadRequestException {
  protected error: ValidationError[];
  constructor(errors: ValidationError[]) {
    super();
    this.error = errors;
  }

  getResponse() {
    const formattedErrors = this.error.map((error) => ({
      field: error.property,
      errors: Object.values(error.constraints || {}),
    }));

    return {
      status: 400,
      message: 'Validation failed',
      details: formattedErrors,
    };
  }
}
