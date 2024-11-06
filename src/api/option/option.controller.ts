import { Controller } from '@nestjs/common';
import { OptionService } from './option.service';
import OptionRoute from './option.routes';
import { InjectRoute } from '@/decorators';

@Controller(OptionRoute.root)
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @InjectRoute(OptionRoute.findAll)
  findAll() {
    return this.optionService.findAll();
  }
}
