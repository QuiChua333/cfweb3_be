import { Module } from '@nestjs/common';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { CampaignModule } from '../campaign/campaign.module';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';
import { ContributionModule } from '../contribution/contribution.module';

@Module({
  imports: [CampaignModule, CloudinaryModule, ContributionModule],
  controllers: [NftController],
  providers: [NftService],
})
export class NftModule {}
