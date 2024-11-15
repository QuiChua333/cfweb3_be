import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CreateReportDto, ReportPaginationDto, ReportQueryStatus } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { ITokenPayload } from '../auth/auth.interface';
import { stat } from 'fs';

@Injectable()
export class ReportService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(reportPaginationDto: ReportPaginationDto) {
    const { page = 1, limit = 10, searchString, status } = reportPaginationDto;

    const query = this.repository.report
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.campaign', 'campaign') // Tham chiếu đúng đến report.campaign
      .leftJoinAndSelect('report.reportBy', 'reportBy') // Tham chiếu đúng đến report.reportBy
      .leftJoinAndSelect('report.reportResponse', 'reportResponse')
      .select([
        'report.id',
        'report.title',
        'report.content',
        'report.images',
        'report.date',
        'report.status',
        'campaign.id', // Chỉ lấy ID để liên kết, nếu cần
        'campaign.title', // Lấy title từ campaign
        'reportBy.id', // Chỉ lấy ID để liên kết, nếu cần
        'reportBy.fullName', // Lấy fullName từ reportBy
        'reportBy.avatar',
        'reportBy.email', // Lấy email từ reportBy
        'reportResponse.id',
        'reportResponse.content', // Thay đổi theo các trường bạn muốn lấy từ ReportResponse
        'reportResponse.date', // Ví dụ t
        'reportResponse.images', // Ví dụ t
      ]);
    // Tìm kiếm không phân biệt hoa thường theo searchString trong title
    if (searchString && searchString.trim() !== '') {
      query.andWhere(
        'report.title ILIKE :searchString OR campaign.title ILIKE :searchString OR reportBy.email ILIKE :searchString OR reportBy.fullName ILIKE :searchString',
        {
          searchString: `%${searchString}%`, // Thêm dấu % để tìm kiếm chuỗi con
        },
      );
    }

    // Tìm kiếm theo status
    if (status && status !== ReportQueryStatus.ALL) {
      query.andWhere('report.status = :status', { status });
    }

    // Phân trang
    const [results, total] = await query
      .take(limit) // Giới hạn số bản ghi trên mỗi trang
      .skip((page - 1) * limit) // Bắt đầu từ vị trí dựa trên trang
      .getManyAndCount(); // Lấy dữ liệu và tổng số bản ghi
    const totalPages = Math.ceil(total / limit);
    return {
      reports: results,
      totalPages,
      page,
      limit,
    };
  }

  async createReport(
    currentUser: ITokenPayload,
    createReportDto: CreateReportDto,
    files: Express.Multer.File[],
  ) {
    const { campaignId, ...createData } = createReportDto;
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const existedReport = await this.repository.report.findOne({
      where: {
        campaign: {
          id: campaignId,
        },
        reportBy: {
          id: currentUser.id,
        },
      },
    });
    if (existedReport) throw new BadRequestException('Bạn đã có đơn tố cáo chiến dịch này');
    const imageArr: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await this.cloudinaryService.uploadFile(file);
      imageArr.push(res.secure_url as string);
    }

    const report = this.repository.report.create({
      campaign: {
        id: campaignId,
      },
      images: imageArr.join('|'),
      reportBy: {
        id: currentUser.id,
      },
      date: new Date(),
      ...createData,
    });
    return await this.repository.report.save(report);
  }
}
