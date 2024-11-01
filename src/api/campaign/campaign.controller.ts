import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import CampaignRoute from './campaign.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { UpdateCampaignDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(CampaignRoute.root)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @InjectRoute(CampaignRoute.createCampaign)
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

  @InjectRoute(CampaignRoute.editCampaign)
  @UseInterceptors(FileInterceptor('file'))
  editCampaign(
    @UploadedFile() file: Express.Multer.File,
    @User() user: ITokenPayload,
    @Param('id') campaignId: string,
    @Body() data: UpdateCampaignDto,
  ) {
    return this.campaignService.editCampaign(campaignId, user, data, file);
  }

  @InjectRoute(CampaignRoute.launchCampaign)
  launchCampaign(@User() user: ITokenPayload, @Param('id') campaignId: string) {
    return this.campaignService.launchCampaign(campaignId, user);
  }
}
