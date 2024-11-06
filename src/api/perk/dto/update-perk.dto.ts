import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ItemInPerkDto } from './create-perk.dto';

export class UpdatePerkDto {
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
