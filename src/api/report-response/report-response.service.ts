import { Injectable } from '@nestjs/common';
import { CreateReportResponseDto } from './dto/create-report-response.dto';
import { UpdateReportResponseDto } from './dto/update-report-response.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class ReportResponseService {
  constructor(
    private readonly repository: RepositoryService
  ) {}
  create(createReportResponseDto: CreateReportResponseDto) {
    return 'This action adds a new reportResponse';
  }

  findAll() {
    return `This action returns all reportResponse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reportResponse`;
  }

  update(id: number, updateReportResponseDto: UpdateReportResponseDto) {
    return `This action updates a #${id} reportResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} reportResponse`;
  }
}
