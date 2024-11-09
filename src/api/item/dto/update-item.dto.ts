import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OptionDto } from './create-item.dto';

export class UpdateItemDto {
  @IsString()
  campaignId: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isHasOption?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  options?: OptionDto[];
}
