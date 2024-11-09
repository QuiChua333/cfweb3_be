import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePerkDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  isFeatured?: string;

  @IsString()
  @IsOptional()
  isVisible?: string;

  @IsString()
  @IsOptional()
  isShipping?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  estDeliveryDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  detailPerks?: string;

  @IsString()
  @IsOptional()
  shippingFees?: string;
}
