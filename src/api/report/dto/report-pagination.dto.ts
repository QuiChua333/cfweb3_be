import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

export enum ReportQueryStatus {
  NO_RESPONSE = 'Chưa phản hồi',
  RESPONSE = 'Đã phản hồi',
  ALL = 'Tất cả',
}

export class ReportPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(ReportQueryStatus)
  @IsOptional()
  status?: ReportQueryStatus;
}
