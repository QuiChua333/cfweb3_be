import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { FieldGroupService } from '../field-group/field-group.service';

@Module({
  controllers: [FieldController],
  providers: [FieldService, FieldGroupService],
})
export class FieldModule {}
