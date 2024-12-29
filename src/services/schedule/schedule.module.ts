import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleModule as ScheduleCronJobModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleCronJobModule.forRoot()],
  providers: [ScheduleService],
})
export class ScheduleModule {}
