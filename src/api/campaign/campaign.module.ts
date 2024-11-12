import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { CloudinaryModule } from '@/services/cloudinary/cloudinary.module';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [CloudinaryModule, EmailModule],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
