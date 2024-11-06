import { Module } from '@nestjs/common';
import { PerkService } from './perk.service';
import { PerkController } from './perk.controller';
import { CampaignModule } from '../campaign/campaign.module';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({
  imports: [CampaignModule, CloudinaryModule],
  controllers: [PerkController],
  providers: [PerkService],
})
export class PerkModule {}
