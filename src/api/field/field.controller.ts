import { Body, Controller, Param, Query } from '@nestjs/common';
import { FieldService } from './field.service';
import FieldRoute from './field.routes';
import { InjectRoute } from '@/decorators';
import { AllFieldDto, CreateFieldDto, UpdateFieldDto } from './dto';

@Controller(FieldRoute.root)
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @InjectRoute(FieldRoute.getAll)
  getAllByFieldGroupId(@Query() queryParam: AllFieldDto) {
    return this.fieldService.getAllByFieldGroupId(queryParam);
  }

  @InjectRoute(FieldRoute.getFieldsGroupByCategory)
  getFieldsGroupByCategory() {
    return this.fieldService.getFieldsGroupByCategory();
  }

  @InjectRoute(FieldRoute.getDetail)
  getDetail(@Param('id') id: string) {
    return this.fieldService.getDetail(id);
  }

  @InjectRoute(FieldRoute.create)
  create(@Body() dto: CreateFieldDto) {
    return this.fieldService.create(dto);
  }

  @InjectRoute(FieldRoute.update)
  update(@Param('id') id: string, @Body() dto: UpdateFieldDto) {
    return this.fieldService.update(id, dto);
  }
  @InjectRoute(FieldRoute.delete)
  delete(@Param('id') id: string) {
    return this.fieldService.delete(id);
  }
}
