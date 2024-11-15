import { PerkPaymentDto, ShippingInfoDto } from '@/api/contribution/dto';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  email: string;

  @IsString()
  campaignId: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @ValidateNested({
    each: true,
  })
  @IsArray()
  perks: PerkPaymentDto[];

  shippingInfo?: ShippingInfoDto;

  @IsNumber()
  money: number;
}
