import { PaginationDto } from '@/common/dto';
import { CampaignStatus } from '@/constants';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

export enum CampaignQueryStatus {
  FUNDING = 'Đang gây quỹ',
  SUCCESS = 'Thành công',
  PENDING = 'Chờ xác nhận',
  TERMINATE = 'Tạm dừng',
  FAILED = 'Thất bại',
  DRAFT = 'Bản nháp',
  ALL = 'Tất cả',
}

export class CampaignPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(CampaignQueryStatus)
  @IsOptional()
  status?: CampaignQueryStatus;
}
