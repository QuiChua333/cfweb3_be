import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import CampaignRoute from './campaign.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(CampaignRoute.root)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @InjectRoute(CampaignRoute.create)
  create(@User() user: ITokenPayload) {
    return this.campaignService.createCampaign(user);
  }

  @InjectRoute(CampaignRoute.findAll)
  findAll() {
    return this.campaignService.findAll();
  }

  @InjectRoute(CampaignRoute.checkOwner)
  checkOwner(@User() user: ITokenPayload, @Param('id') campaignId: string) {
    return this.campaignService.checkOwner(campaignId, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
    return this.campaignService.update(+id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(+id);
  }
}
