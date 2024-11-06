import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

export class OptionDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  values: string[];
}

export class CreateItemDto {
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
