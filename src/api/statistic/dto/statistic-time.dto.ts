import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class StatisticCampaignTimeDto {
  @IsString()
  quarter: string;

  @IsString()
  year: string;
}
