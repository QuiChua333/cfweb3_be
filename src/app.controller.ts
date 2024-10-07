import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'Hello Server';
  }
}
