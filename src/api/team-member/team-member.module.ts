import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';
import { CampaignModule } from '../campaign/campaign.module';

@Module({
  imports: [CampaignModule],
  controllers: [TeamMemberController],
  providers: [TeamMemberService],
})
export class TeamMemberModule {}
