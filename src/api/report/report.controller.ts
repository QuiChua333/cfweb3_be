import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { InjectRoute, User } from '@/decorators';
import ReportRoute from './report.routes';
import { CreateReportDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(ReportRoute.root)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @InjectRoute(ReportRoute.findAll)
  findAll() {
    return this.reportService.findAll();
  }

  @InjectRoute(ReportRoute.createReport)
  @UseInterceptors(FilesInterceptor('files'))
  createReport(
    @User() currentUser: ITokenPayload,
    @Body() createReportDto: CreateReportDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.reportService.createReport(currentUser, createReportDto, files);
  }
}
