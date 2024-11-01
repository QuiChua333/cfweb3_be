import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';
export enum CampaignImageTypeName {
  CARD_IMAGE = 'cardImage',
  IMAGE_DETAIL_PAGE = 'imageDetailPage',
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
  goal: number;
}
