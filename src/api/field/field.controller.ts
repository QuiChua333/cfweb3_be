import { Controller } from '@nestjs/common';
import { FieldService } from './field.service';
import FieldRoute from './field.routes';
import { InjectRoute } from '@/decorators';

@Controller(FieldRoute.root)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @InjectRoute(FieldRoute.getFieldsGroupByCategory)
  getFieldsGroupByCategory() {
    return this.fieldService.getFieldsGroupByCategory();
  }
}
