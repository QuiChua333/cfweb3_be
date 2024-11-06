import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { CampaignModule } from '../campaign/campaign.module';

@Module({
  imports: [CampaignModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
