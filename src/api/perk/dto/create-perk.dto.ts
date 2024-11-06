import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ItemInPerkDto {
  @IsString()
  itemId: string;
  quantity: number;
}
export class CreatePerkDto {
  @IsString()
  campaignId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isFeatured: boolean;

  @IsBoolean()
  isVisible: boolean;

  @IsBoolean()
  isShipping: boolean;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsDate()
  estDeliveryDate: Date;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  items: ItemInPerkDto[];
}
