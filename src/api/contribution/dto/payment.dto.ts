import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class PaymentDto {
  shippingInfo?: ShippingInfoDto;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  shippingFee?: number;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  bankName: string;

  @IsString()
  bankAccountNumber: string;

  @IsString()
  bankUsername: string;

  @IsString()
  campaignId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @ValidateNested({
    each: true,
  })
  @IsArray()
  @IsOptional()
  perks?: PerkPaymentDto[];

  @IsNumber()
  @Type(() => Number)
  money: number;
}

export class ShippingInfoDto {
  @IsString()
  @IsOptional()
  estDeliveryDate?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  district?: string;
}

export class PerkPaymentDto {
  @IsString()
  id: string;

  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @ValidateNested({
    each: true,
  })
  @IsArray()
  options: OptionPaymentDto[];
}

class OptionPaymentDto {
  @IsString()
  name: string;

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsString()
  @IsOptional()
  optionsString?: string;
}
