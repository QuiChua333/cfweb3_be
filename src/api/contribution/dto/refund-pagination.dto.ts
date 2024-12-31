import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum RefundQueryStatus {
  ALL = 'Tất cả',
  FINISH = 'Đã hoàn trả',
  NO_FINISH = 'Chưa hoàn trả',
}

export enum RefundSortMoneyQueryStatus {
  ALL = 'Tất cả',
  ASC = 'Tăng dần',
  DSC = 'Giảm dần',
}

export class RefundPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(RefundSortMoneyQueryStatus)
  @IsOptional()
  sortMoney?: RefundSortMoneyQueryStatus;

  @IsEnum(RefundQueryStatus)
  @IsOptional()
  status?: RefundQueryStatus;

  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
