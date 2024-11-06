import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { OptionDto } from './create-item.dto';

export class UpdateItemDto {
  @IsString()
  campaignId: string;

  @IsString()
  name: string;

  @IsBoolean()
  isHasOption: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  options: OptionDto[];
}
