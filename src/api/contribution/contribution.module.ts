import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { CampaignModule } from '../campaign/campaign.module';

@Module({
  imports: [CampaignModule],
  controllers: [ContributionController],
  providers: [ContributionService],
})
export class ContributionModule {}
