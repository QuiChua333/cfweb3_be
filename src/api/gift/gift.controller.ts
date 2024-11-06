import { Body, Controller, Param } from '@nestjs/common';
import { GiftService } from './gift.service';
import { InjectRoute } from '@/decorators';
import GiftRoute from './gift.routes';
import { CreateGiftDto, EditGiftDto } from './dto';

@Controller(GiftRoute.root)
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @InjectRoute(GiftRoute.addGift)
  addGift(@Body() createGiftDto: CreateGiftDto) {
    return this.giftService.addGift(createGiftDto);
  }

  @InjectRoute(GiftRoute.editGift)
  editGift(@Body() editGiftDto: EditGiftDto, @Param('id') giftId: string) {
    return this.giftService.editGift(editGiftDto, giftId);
  }
}
