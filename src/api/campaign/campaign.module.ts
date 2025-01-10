import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';
import { EmailModule } from '@/services/email/email.module';
import { SearchModule } from '@/services/search/search.module';

@Module({
  imports: [CloudinaryModule, EmailModule, SearchModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
