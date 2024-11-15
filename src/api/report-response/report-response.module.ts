import { Module } from '@nestjs/common';
import { ReportResponseService } from './report-response.service';
import { ReportResponseController } from './report-response.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ReportResponseController],
  providers: [ReportResponseService],
})
export class ReportResponseModule {}
