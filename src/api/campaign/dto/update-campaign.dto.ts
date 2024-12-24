import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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
  @Type(() => Number)
  @IsOptional()
  goal?: number;

  @IsString()
  @IsOptional()
  fieldId?: string;

  @IsOptional()
  faqs?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  bankUsername?: string;

  @IsBoolean()
  @IsOptional()
  cryptocurrencyMode?: boolean;

  @IsString()
  @IsOptional()
  walletAddress?: string;
}
