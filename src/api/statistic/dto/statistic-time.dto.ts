import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatisticTimeDto {
  @IsString()
  quarter: string;

  @IsString()
  year: string;
}
