import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CreateReportDto } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { ITokenPayload } from '../auth/auth.interface';

@Injectable()
export class ReportService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return `This action returns all report`;
  }

  async createReport(
    currentUser: ITokenPayload,
    createReportDto: CreateReportDto,
    files: Express.Multer.File[],
  ) {
    const { campaignId, ...createData } = createReportDto;
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const imageArr: string[] = [];
    files.forEach(async (file) => {
      const res = await this.cloudinaryService.uploadFile(file);
      imageArr.push(res.secure_url as string);
    });
    const report = this.repository.report.create({
      campaign: {
        id: campaignId,
      },
      images: imageArr.join('|'),
      reportBy: {
        id: currentUser.id,
      },
      ...createData,
    });
    return await this.repository.report.save(report);
  }
}
