import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { InjectRoute, User } from '@/decorators';
import TeamMemberRoute from './team-member.routes';
import { InvitateMemberDto } from './dto';
import { ITokenPayload } from '../auth/auth.interface';

@Controller(TeamMemberRoute.root)
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @InjectRoute(TeamMemberRoute.getTeamMemberByCampaignId)
  getTeamMemberByCampaignId(@Param('id') campaignId: string) {
    return this.teamMemberService.getTeamMemberByCampaignId(campaignId);
  }

  @InjectRoute(TeamMemberRoute.invitateMember)
  invitateMember(
    @Param('campaignId') campaignId: string,
    @Body() invitateMemberDto: InvitateMemberDto,
    @User() user: ITokenPayload,
  ) {
    return this.teamMemberService.invitateMember(campaignId, invitateMemberDto, user);
  }

  @InjectRoute(TeamMemberRoute.deleteMember)
  deleteMember(
    @Param('campaignId') campaignId: string,
    @Param('userId') userId: string,
    @User() currentUser: ITokenPayload,
  ) {
    return this.teamMemberService.deleteMember(campaignId, userId, currentUser);
  }
}
