import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FollowCampaignService } from './follow-campaign.service';
import FollowCampaignRoute from './follow-campaign.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { FollowCampaignDto } from './dto';
import { CampaignPaginationDto } from '../campaign/dto';

@Controller(FollowCampaignRoute.root)
export class FollowCampaignController {
  constructor(private readonly followCampaignService: FollowCampaignService) {}

  @InjectRoute(FollowCampaignRoute.getCampaignsFollowed)
  getCampaignsFollowed(
    @Param('userId') userId: string,
    @Query() campaignPaginationDto: CampaignPaginationDto,
  ) {
    return this.followCampaignService.getCampaignsFollowed(userId, campaignPaginationDto);
  }

  @InjectRoute(FollowCampaignRoute.follow)
  follow(@User() user: ITokenPayload, @Body() followCampaignDto: FollowCampaignDto) {
    return this.followCampaignService.follow(user, followCampaignDto);
  }

  @InjectRoute(FollowCampaignRoute.getQuantityFollowsOfCampaign)
  getQuantityFollowsOfCampaign(@Param('campaignId') id: string) {
    return this.followCampaignService.getQuantityFollowsOfCampaign(id);
  }
}
