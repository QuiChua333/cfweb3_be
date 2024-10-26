import { Module } from '@nestjs/common';
import { FieldGroupService } from './field-group.service';
import { FieldGroupController } from './field-group.controller';

@Module({
  controllers: [FieldGroupController],
  providers: [FieldGroupService],
})
export class FieldGroupModule {}
