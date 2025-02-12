import { Module } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { FieldGroupController } from './field-group.controller';
import { FieldService } from '../field/field.service';

@Module({
  controllers: [FieldGroupController],
  providers: [FieldGroupService, FieldService],
})
export class FieldGroupModule {}
