import { Body, Controller, Param, Query } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import FieldGroupRoute from './field-group.routes';
import { InjectRoute } from '@/decorators';
import { AllFieldGroupDto, CreateFieldGroupDto, UpdateFieldGroupDto } from './dto';

@Controller(FieldGroupRoute.root)
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @InjectRoute(FieldGroupRoute.getAll)
  getAll(@Query() queryParam: AllFieldGroupDto) {
    return this.fieldGroupService.getAll(queryParam);
  }

  @InjectRoute(FieldGroupRoute.getDetail)
  getDetail(@Param('id') id: string) {
    return this.fieldGroupService.getDetail(id);
  }

  @InjectRoute(FieldGroupRoute.create)
  create(@Body() dto: CreateFieldGroupDto) {
    return this.fieldGroupService.create(dto);
  }

  @InjectRoute(FieldGroupRoute.update)
  update(@Param('id') id: string, @Body() dto: UpdateFieldGroupDto) {
    return this.fieldGroupService.update(id, dto);
  }
  @InjectRoute(FieldGroupRoute.delete)
  delete(@Param('id') id: string) {
    return this.fieldGroupService.delete(id);
  }

}
