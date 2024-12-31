import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRefundDto {
  @IsString()
  @IsOptional()
  isRefund?: string;
}
