import { IsOptional, IsString } from 'class-validator';

export class UpdateVerifyUserDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  bod?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  identifyNumber?: string;
}
