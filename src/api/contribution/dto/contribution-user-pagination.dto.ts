import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ContributionUserFinishQueryStatus {
  ALL = 'Tất cả',
  FINISH = 'Đã nhận',
  NO_FINISH = 'Chưa nhận',
}

export class ContributionUserPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(ContributionUserFinishQueryStatus)
  @IsOptional()
  status?: ContributionUserFinishQueryStatus;
}
