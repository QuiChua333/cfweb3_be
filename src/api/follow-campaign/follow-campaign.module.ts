import { Module } from '@nestjs/common';
import { FollowCampaignService } from './follow-campaign.service';
import { FollowCampaignController } from './follow-campaign.controller';

@Module({
  controllers: [FollowCampaignController],
  providers: [FollowCampaignService],
})
export class FollowCampaignModule {}
