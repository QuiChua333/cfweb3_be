import { IsNumber, IsObject, IsString } from 'class-validator';

export class CreateGiftDto {
  @IsString()
  campaignId: string;

  @IsString()
  userId: string;

  @IsObject()
  perks: Object;

  @IsObject()
  shippingInfo: Object;

  @IsNumber()
  money: number;
}
