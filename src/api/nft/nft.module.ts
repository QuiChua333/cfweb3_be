import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { CampaignModule } from '../campaign/campaign.module';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';

@Module({
  imports: [CampaignModule, CloudinaryModule],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
