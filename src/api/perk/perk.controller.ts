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
import { PerkService } from './perk.service';
import { InjectRoute, User } from '@/decorators';
import PerkRoute from './perk.routes';
import { CreatePerkDto, UpdatePerkDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(PerkRoute.root)
export class PerkController {
  constructor(private readonly perkService: PerkService) {}

  @InjectRoute(PerkRoute.findAll)
  findAll() {
    return this.perkService.findAll();
  }

  @InjectRoute(PerkRoute.getPerksByCampaign)
  getPerksByCampaign(@Param('id') campaignId: string) {
    return this.perkService.getPerksByCampaign(campaignId);
  }

  @InjectRoute(PerkRoute.getPerk)
  getPerk(@Param('id') perkId: string) {
    return this.perkService.getPerk(perkId);
  }

  @InjectRoute(PerkRoute.deletePerk)
  deletePerk(@User() currentUser: ITokenPayload, @Param('id') perkId: string) {
    return this.perkService.deletePerk(currentUser, perkId);
  }

  @InjectRoute(PerkRoute.addPerk)
  @UseInterceptors(FileInterceptor('file'))
  addPerk(
    @User() currentUser: ITokenPayload,
    @Body() createPerkDto: CreatePerkDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.perkService.addPerk(currentUser, createPerkDto, file);
  }

  @InjectRoute(PerkRoute.editPerk)
  @UseInterceptors(FileInterceptor('file'))
  editPerk(
    @User() currentUser: ITokenPayload,
    @Body() updatePerkDto: UpdatePerkDto,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') perkid: string,
  ) {
    return this.perkService.editPerk(currentUser, updatePerkDto, file, perkid);
  }

  @InjectRoute(PerkRoute.getPerksContainItemsByCampaignId)
  getPerksContainItemsByCampaignId(@Param('campaignId') campaignId: string) {
    return this.perkService.getPerksContainItemsByCampaignId(campaignId);
  }
}
