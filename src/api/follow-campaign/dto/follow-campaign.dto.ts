import { IsNotEmpty, IsString } from 'class-validator';

export class FollowCampaignDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
