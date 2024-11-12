import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';

export enum UserVerifyQueryStatus {
  ALL = 'Tất cả',
  UNVERIFY = 'Chưa xác thực',
  PENDING = 'Chờ xác thực',
  SUCCESS = 'Đã xác thực',
}

export enum UserQueryStatus {
  ALL = 'Tất cả',
  INACTIVATE = 'Tạm khóa',
  ACTIVATE = 'Đang hoạt động',
}

export class UserPaginationDto extends PartialType(PaginationDto) {
  @IsEnum(UserQueryStatus)
  @IsOptional()
  userStatus?: UserQueryStatus;

  @IsEnum(UserVerifyQueryStatus)
  @IsOptional()
  userVerifyStatus?: UserVerifyQueryStatus;
}
