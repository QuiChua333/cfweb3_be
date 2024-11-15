import { IsString } from 'class-validator';

export class ResponseReportDto {
  @IsString()
  content: string;
}
