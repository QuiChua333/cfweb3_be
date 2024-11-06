import { Controller } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import FieldGroupRoute from './field-group.routes';
import { InjectRoute } from '@/decorators';

@Controller(FieldGroupRoute.root)
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @InjectRoute(FieldGroupRoute.findAll)
  findAll() {
    return this.fieldGroupService.findAll();
  }
}
