import { PaginationDto } from '@/common/dto';
import { CampaignStatus } from '@/constants';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CampaignExploreQueryStatus {
  FUNDING = 'Đang gây quỹ',
  SUCCESS = 'Thành công',
  FAILED = 'Thất bại',
  TERMINATE = 'Tạm dừng',
  ALL = 'Tất cả',
}

export class CampaignExplorePaginationDto extends PartialType(PaginationDto) {
  @IsEnum(CampaignExploreQueryStatus)
  @IsOptional()
  status?: CampaignExploreQueryStatus;

  @IsString()
  @IsOptional()
  criteria?: 'new' | 'most';

  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  fieldGroup?: string;
}
