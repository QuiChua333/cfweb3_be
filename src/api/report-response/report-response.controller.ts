import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportResponseService } from './report-response.service';
import { CreateReportResponseDto } from './dto/create-report-response.dto';
import { UpdateReportResponseDto } from './dto/update-report-response.dto';
import ReportResponseRoute from './report-response.routes';
import { InjectRoute } from '@/decorators';

@Controller('report-response')
export class ReportResponseController {
  constructor(private readonly reportResponseService: ReportResponseService) {}

  @Post()
  create(@Body() createReportResponseDto: CreateReportResponseDto) {
    return this.reportResponseService.create(createReportResponseDto);
  }

  @InjectRoute(ReportResponseRoute.findAll)
  findAll() {
    return this.reportResponseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportResponseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportResponseDto: UpdateReportResponseDto) {
    return this.reportResponseService.update(+id, updateReportResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportResponseService.remove(+id);
  }
}
