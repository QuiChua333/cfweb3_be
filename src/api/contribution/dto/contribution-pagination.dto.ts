import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ContributionFinishQueryStatus {
  ALL = 'Tất cả',
  FINISH = 'Đã gửi',
  NO_FINISH = 'Chưa gửi',
}

export enum ContributionSortMoneyQueryStatus {
  ALL = 'Tất cả',
  ASC = 'Tăng dần',
  DSC = 'Giảm dần',
}

export enum ContributionSortContributionDateQueryStatus {
  ALL = 'Tất cả',
  Nearest = 'Gần đây nhất',
  Earliest = 'Sớm nhất',
}

export class ContributionPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(ContributionSortMoneyQueryStatus)
  @IsOptional()
  sortMoney?: ContributionSortMoneyQueryStatus;

  @IsEnum(ContributionFinishQueryStatus)
  @IsOptional()
  status?: ContributionFinishQueryStatus;

  @IsEnum(ContributionSortContributionDateQueryStatus)
  @IsOptional()
  sortContributionDate?: ContributionSortContributionDateQueryStatus;

  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
