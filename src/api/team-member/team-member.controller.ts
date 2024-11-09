import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { InjectRoute, User } from '@/decorators';
import TeamMemberRoute from './team-member.routes';
import { InvitateMemberDto, UpdateTeamMemberDto } from './dto';
import { ITokenPayload } from '../auth/auth.interface';
import { envs } from '@/config';

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
    @Param('email') email: string,
    @User() currentUser: ITokenPayload,
  ) {
    return this.teamMemberService.deleteMember(campaignId, email, currentUser);
  }

  @InjectRoute(TeamMemberRoute.confirmInvitation)
  async confirmInvitation(@Query('token') token: string, @Res() res) {
    const { email, campaignId, existedUser } =
      await this.teamMemberService.confirmInvitation(token);

    if (!existedUser) res.redirect(`${envs.fe.homeUrl}/login`);
    else res.redirect(`${envs.fe.homeUrl}/campaigns/${campaignId}/edit/team`);
    //redirect to fe verify email success
  }

  @InjectRoute(TeamMemberRoute.editTeamMembers)
  editTeamMembers(
    @User() currentUser: ITokenPayload,
    @Param('campaignId') campaignId: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    return this.teamMemberService.editTeamMembers(currentUser, campaignId, updateTeamMemberDto);
  }
}
