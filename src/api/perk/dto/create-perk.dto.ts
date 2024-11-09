import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { boolean } from 'joi';

export class DetailPerkDto {
  @IsString()
  itemId: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;
}

export class ShippingFeeDto {
  @IsString()
  location: string;

  @IsNumber()
  fee: number;
}
export class CreatePerkDto {
  @IsString()
  campaignId: string;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsString()
  isFeatured: string = 'false';

  @IsString()
  isVisible: string;

  @IsString()
  isShipping: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  estDeliveryDate: string;

  @IsString()
  description: string;

  @IsString()
  detailPerks: string;

  @IsString()
  @IsOptional()
  shippingFees?: string;
}
