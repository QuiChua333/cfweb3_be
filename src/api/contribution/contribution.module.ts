import { Module } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { ContributionController } from './contribution.controller';
import { CampaignModule } from '../campaign/campaign.module';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [CampaignModule, EmailModule],
  controllers: [ContributionController],
  providers: [ContributionService],
})
export class ContributionModule {}
