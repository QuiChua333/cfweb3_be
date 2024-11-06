import { IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  campaignId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
