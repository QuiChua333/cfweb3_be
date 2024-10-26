import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { CreateFieldGroupDto } from './dto/create-field-group.dto';
import { UpdateFieldGroupDto } from './dto/update-field-group.dto';
import FieldGroupRoute from './field-group.routes';
import { InjectRoute } from '@/decorators';

@Controller(FieldGroupRoute.root)
export class FieldGroupController {
  constructor(private readonly fieldGroupService: FieldGroupService) {}

  @Post()
  create(@Body() createFieldGroupDto: CreateFieldGroupDto) {
    return this.fieldGroupService.create(createFieldGroupDto);
  }

  @InjectRoute(FieldGroupRoute.findAll)
  findAll() {
    return this.fieldGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFieldGroupDto: UpdateFieldGroupDto) {
    return this.fieldGroupService.update(+id, updateFieldGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fieldGroupService.remove(+id);
  }
}
