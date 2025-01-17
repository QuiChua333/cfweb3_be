import { PaginationDto } from '@/common/dto';
import { CampaignStatus } from '@/constants';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

export enum CampaignSendStatus {
  UNSEND = 'Chưa gửi',
  SEND = 'Đã gửi',
  ALL = 'Tất cả',
}
export class CampaignSuccessPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(CampaignSendStatus)
  @IsOptional()
  status?: CampaignSendStatus;
}
