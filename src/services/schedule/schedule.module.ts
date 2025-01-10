import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleModule as ScheduleCronJobModule } from '@nestjs/schedule';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [ScheduleCronJobModule.forRoot(), EmailModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
