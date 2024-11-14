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
  Req,
  Query,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import CampaignRoute from './campaign.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignExplorePaginationDto, CampaignPaginationDto, UpdateCampaignDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CampaignStatus } from '@/constants';

@Controller(CampaignRoute.root)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @InjectRoute(CampaignRoute.createCampaign)
  create(@User() user: ITokenPayload) {
    return this.campaignService.createCampaign(user);
  }

  @InjectRoute(CampaignRoute.findAll)
  findAll(@Query() campaignPaginationDto: CampaignPaginationDto) {
    return this.campaignService.findAll(campaignPaginationDto);
  }

  @InjectRoute(CampaignRoute.getCampaignsExplore)
  getCampaignsExplore(@Query() campaignExplorePaginationDto: CampaignExplorePaginationDto) {
    return this.campaignService.getCampaignsExplore(campaignExplorePaginationDto);
  }

  @InjectRoute(CampaignRoute.getCampaignById)
  getCampaignById(@Param('id') id: string) {
    return this.campaignService.findOneDetail(id);
  }

  @InjectRoute(CampaignRoute.getQuantitySuccessCampaignByCampaignId)
  getQuantitySuccessCampaignByCampaignId(@Param('campaignId') campaignId: string) {
    return this.campaignService.getQuantitySuccessCampaignByCampaignId(campaignId);
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

  @InjectRoute(CampaignRoute.deleteCampaign)
  deleteCampaign(@User() user: ITokenPayload, @Param('id') campaignId: string) {
    return this.campaignService.deleteCampaign(campaignId, user);
  }

  @InjectRoute(CampaignRoute.getCampaignsOfOwner)
  getCampaignsOfOwner(@Param('userId') userId: string) {
    return this.campaignService.getCampaignsOfOwner(userId);
  }

  @InjectRoute(CampaignRoute.getQuantityCampaignsOfOwner)
  getQuantityCampaignsOfOwner(@Param('campaignId') campaignId: string) {
    return this.campaignService.getQuantityCampaignsOfOwner(campaignId);
  }

  @InjectRoute(CampaignRoute.getPopularCampaigns)
  getPopularCampaigns() {
    return this.campaignService.getPopularCampaigns();
  }

  @InjectRoute(CampaignRoute.CKEUpload)
  @UseInterceptors(FileInterceptor('file'))
  CKEUpload(@UploadedFile() file: Express.Multer.File) {
    return this.campaignService.CKEUpload(file);
  }

  @InjectRoute(CampaignRoute.adminChangeStatus)
  adminChangeStatus(
    @Body() { status }: { status: CampaignStatus.TERMINATE | CampaignStatus.FUNDING },
    @Param('campaignId') campaignId: string,
  ) {
    return this.campaignService.adminChangeStatus(campaignId, status);
  }
}
