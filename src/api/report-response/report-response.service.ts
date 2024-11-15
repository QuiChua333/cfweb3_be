import { Injectable, NotFoundException } from '@nestjs/common';

import { RepositoryService } from '@/repositories/repository.service';
import { ResponseReportDto } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { ReportStatus } from '@/constants';

@Injectable()
export class ReportResponseService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return `This action returns all reportResponse`;
  }

  async responseReport(
    responseReportDto: ResponseReportDto,
    files: Express.Multer.File[],
    reportId: string,
  ) {
    const report = await this.repository.report.findOneBy({ id: reportId });
    if (!report) throw new NotFoundException('Khiếu nại không tồn tại');
    const { content } = responseReportDto;
    const imageArr: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await this.cloudinaryService.uploadFile(file);
      imageArr.push(res.secure_url as string);
    }

    const reportResponse = this.repository.reportResponse.create({
      images: imageArr.join('|'),
      date: new Date(),
      content,
      report: {
        id: reportId,
      },
    });
    await this.repository.report.save({
      id: reportId,
      status: ReportStatus.RESPONSE,
    });
    return await this.repository.reportResponse.save(reportResponse);
  }
}
