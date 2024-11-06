import { Body, Controller, Param } from '@nestjs/common';
import { ItemService } from './item.service';

import ItemRoute from './item.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateItemDto, UpdateItemDto } from './dto';

@Controller(ItemRoute.root)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @InjectRoute(ItemRoute.findAll)
  findAll() {
    return this.itemService.findAll();
  }

  @InjectRoute(ItemRoute.getItemsByCampaign)
  getItemsByCampaign(@Param('id') campaignId: string) {
    return this.itemService.getItemsByCampaign(campaignId);
  }

  @InjectRoute(ItemRoute.addItem)
  addItem(@User() currentUser: ITokenPayload, @Body() createItemDto: CreateItemDto) {
    return this.itemService.addItem(currentUser, createItemDto);
  }

  @InjectRoute(ItemRoute.editItem)
  editItem(
    @User() currentUser: ITokenPayload,
    @Body() updateItemDto: UpdateItemDto,
    @Param('id') itemId: string,
  ) {
    return this.itemService.editItem(currentUser, updateItemDto, itemId);
  }

  @InjectRoute(ItemRoute.deleteItem)
  deleteItem(@Param('id') itemId: string) {
    return this.itemService.deleteItem(itemId);
  }

  @InjectRoute(ItemRoute.getItemsContainPerksByCampaignId)
  getItemsContainPerksByCampaignId(@Param('campaignId') campaignId: string) {
    return this.itemService.getItemsContainPerksByCampaignId(campaignId);
  }

  @InjectRoute(ItemRoute.getItemContainPerks)
  getItemContainPerks(@Param('id') itemId: string) {
    return this.itemService.getItemContainPerks(itemId);
  }
}
