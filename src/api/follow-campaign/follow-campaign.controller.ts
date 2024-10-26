import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FollowCampaignService } from './follow-campaign.service';
import { CreateFollowCampaignDto } from './dto/create-follow-campaign.dto';
import { UpdateFollowCampaignDto } from './dto/update-follow-campaign.dto';
import FollowCampaignRoute from './follow-campaign.routes';
import { InjectRoute } from '@/decorators';

@Controller(FollowCampaignRoute.root)
export class FollowCampaignController {
  constructor(private readonly followCampaignService: FollowCampaignService) {}

  @Post()
  create(@Body() createFollowCampaignDto: CreateFollowCampaignDto) {
    return this.followCampaignService.create(createFollowCampaignDto);
  }

  @InjectRoute(FollowCampaignRoute.findAll)
  findAll() {
    return this.followCampaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.followCampaignService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFollowCampaignDto: UpdateFollowCampaignDto) {
    return this.followCampaignService.update(+id, updateFollowCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followCampaignService.remove(+id);
  }
}
