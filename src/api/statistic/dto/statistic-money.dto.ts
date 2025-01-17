import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatisticMoneyTimeDto {
  @IsString()
  year: string;
}
