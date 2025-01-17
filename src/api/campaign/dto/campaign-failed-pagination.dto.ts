import { PaginationDto } from '@/common/dto';
import { CampaignStatus } from '@/constants';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

export enum CampaignRefundStatus {
  UNSEND = 'Chưa hoàn trả',
  SEND = 'Đã hoàn trả',
  ALL = 'Tất cả',
}
export class CampaignFailedPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(CampaignRefundStatus)
  @IsOptional()
  status?: CampaignRefundStatus;
}
