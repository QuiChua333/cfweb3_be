import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateNFTDto {
  @IsString()
  campaignId: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsString()
  ethPrice: string;

  @IsString()
  description: string;

  @IsString()
  color: string;

  @IsString()
  materials: string;

  @IsString()
  styles: string;

  @IsNumber()
  @Type(() => Number)
  supply: number;
}
