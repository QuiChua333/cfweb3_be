import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleModule as ScheduleCronJobModule } from '@nestjs/schedule';
import { EmailModule } from '../email/email.module';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [ScheduleCronJobModule.forRoot(), EmailModule, SearchModule],
  providers: [ScheduleService],
})
export class ScheduleModule {}
