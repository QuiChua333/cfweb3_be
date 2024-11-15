import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FollowCampaignService } from './follow-campaign.service';
import FollowCampaignRoute from './follow-campaign.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { FollowCampaignDto } from './dto';

@Controller(FollowCampaignRoute.root)
export class FollowCampaignController {
  constructor(private readonly followCampaignService: FollowCampaignService) {}

  @InjectRoute(FollowCampaignRoute.getCampaignsFollowed)
  getCampaignsFollowed(@Query('userId') userId: string) {
    return this.followCampaignService.getCampaignsFollowed(userId);
  }

  @InjectRoute(FollowCampaignRoute.follow)
  follow(@User() user: ITokenPayload, @Body() followCampaignDto: FollowCampaignDto) {
    return this.followCampaignService.follow(user, followCampaignDto);
  }
}
