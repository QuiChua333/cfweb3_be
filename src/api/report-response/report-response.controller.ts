import { Body, Controller, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ReportResponseService } from './report-response.service';
import ReportResponseRoute from './report-response.routes';
import { InjectRoute } from '@/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseReportDto } from './dto';

@Controller(ReportResponseRoute.root)
export class ReportResponseController {
  constructor(private readonly reportResponseService: ReportResponseService) {}

  @InjectRoute(ReportResponseRoute.findAll)
  findAll() {
    return this.reportResponseService.findAll();
  }

  @InjectRoute(ReportResponseRoute.responseReport)
  @UseInterceptors(FilesInterceptor('files'))
  responseReport(
    @Body() responseReportDto: ResponseReportDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('reportId') reportId: string,
  ) {
    return this.reportResponseService.responseReport(responseReportDto, files, reportId);
  }
}
