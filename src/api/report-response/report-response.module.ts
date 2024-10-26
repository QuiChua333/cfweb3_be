import { Module } from '@nestjs/common';
import { ReportResponseService } from './report-response.service';
import { ReportResponseController } from './report-response.controller';

@Module({
  controllers: [ReportResponseController],
  providers: [ReportResponseService],
})
export class ReportResponseModule {}
