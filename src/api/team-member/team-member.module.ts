import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';
import { CampaignModule } from '../campaign/campaign.module';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [CampaignModule, EmailModule],
  controllers: [TeamMemberController],
  providers: [TeamMemberService],
})
export class TeamMemberModule {}
