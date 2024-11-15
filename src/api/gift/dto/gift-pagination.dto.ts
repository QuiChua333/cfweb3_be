import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum GiftFinishQueryStatus {
  ALL = 'Tất cả',
  FINISH = 'Đã gửi',
  NO_FINISH = 'Chưa gửi',
}

export class GiftPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(GiftFinishQueryStatus)
  @IsOptional()
  status?: GiftFinishQueryStatus;

  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
