import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
export enum CampaignImageTypeName {
  CARD_IMAGE = 'cardImage',
  IMAGE_DETAIL_PAGE = 'imageDetailPage',
}

export class FaqDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;
}
export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  // @IsString()
  // @IsOptional()
  // imageDetailPage?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @Max(60)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  duration?: number;

  // @IsString()
  // @IsOptional()
  // cardImage?: string;

  @IsEnum([CampaignImageTypeName.CARD_IMAGE, CampaignImageTypeName.IMAGE_DETAIL_PAGE])
  @IsOptional()
  imageTypeName?: CampaignImageTypeName;

  @IsString()
  @IsOptional()
  youtubeUrl?: string;

  @IsString()
  @IsOptional()
  story?: string;

  @IsNumber()
  @IsOptional()
  goal?: number;

  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  faqs?: FaqDto[];
}
