import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
