import { PartialType } from '@nestjs/mapped-types';
import { CreateReportResponseDto } from './create-report-response.dto';

export class UpdateReportResponseDto extends PartialType(CreateReportResponseDto) {}
