import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CampaignService } from '../campaign/campaign.service';
import { ITokenPayload } from '../auth/auth.interface';
import { InvitateMemberDto, UpdateTeamMemberDto } from './dto';
import { EmailService } from '@/services/email/email.service';
import { AuthService } from '../auth/auth.service';
import { ConfirmMemberStatus, Role, VerifyStatus } from '@/constants';
import { JwtService } from '@nestjs/jwt';
import { envs } from '@/config';
import { id } from 'ethers';

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async getTeamMemberByCampaignId(campaignId: string) {
    const campaign = await this.repository.campaign.findOne({
      where: {
        id: campaignId,
      },
      relations: {
        owner: true,
      },
    });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const members = await this.repository.teamMember.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: {
        user: true,
      },
    });
    const newMembers = members.map((member) => {
      return {
        userId: member.user?.id || '',
        email: member.email,
        name: member.user?.fullName || '',
        avatar: member.user?.avatar || '',
        role: member.role,
        confirmStatus: member.confirmStatus,
        isEdit: member.isEdit,
        isOwner: false,
      };
    });
    const owner = {
      userId: campaign.owner?.id || '',
      email: campaign.owner.email,
      name: campaign.owner.fullName,
      avatar: campaign.owner.avatar,
      isOwner: true,
    };
    const response = [owner, ...newMembers];
    return response;
  }

  async invitateMember(
    campaignId: string,
    invitateMemberDto: InvitateMemberDto,
    user: ITokenPayload,
  ) {
    // checkowner
    const campaign = await this.campaignService.checkOwner(campaignId, user);
    const { email, isEdit } = invitateMemberDto;
    const invitatedUser = await this.repository.user.findOne({
      where: {
        email: email,
      },
    });
    const isExisted = await this.repository.teamMember.findOne({
      where: {
        user: {
          id: user.id,
        },
        campaign: {
          id: campaignId,
        },
      },
    });

    if (isExisted)
      throw new BadRequestException('Người dùng này đã được mời vào chiến dịch của bạn');

    let invitatedUserId: string;
    if (invitatedUser && invitatedUser.isVerifiedEmail) {
      invitatedUserId = invitatedUser.id;
    }

    const invitationToken = await this.jwtService.signAsync(
      { email: email, campaignId },
      {
        secret: `${envs.jwt.linkSecret} invitation`,
        expiresIn: '7d',
      },
    );

    this.emailService.sendInvitationTeamLink({
      campaign,
      email,
      invitationToken: invitationToken,
    });
    return await this.repository.teamMember.save({
      campaign: {
        id: campaignId,
      },
      isEdit,
      user: {
        id: invitatedUserId,
      },
      email: email,
    });
  }

  async confirmInvitation(token: string) {
    const { email, campaignId } = await this.jwtService.verifyAsync(token, {
      secret: `${envs.jwt.linkSecret} invitation`,
    });

    const user = await this.repository.user.findOne({
      where: {
        email: email,
      },
    });

    if (!user || !user.isVerifiedEmail) {
      return { existedUser: false, email, campaignId };
    }
    const member = await this.repository.teamMember.findOne({
      where: {
        email,
        campaign: {
          id: campaignId,
        },
      },
    });

    member.confirmStatus = ConfirmMemberStatus.ACCEPTED;
    await this.repository.teamMember.save(member);

    return { existedUser: true, email, campaignId };
  }

  async updateUserIdMember(campaignId: string, email: string) {
    const teamMember = await this.repository.teamMember.findOne({
      where: {
        campaign: {
          id: campaignId,
        },
        email,
      },
    });

    if (!teamMember) throw new BadRequestException('Thành viên không tồn tại');
    const user = await this.repository.user.findOneBy({ email });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    await this.repository.teamMember.save({
      id: teamMember.id,
      user: {
        id: user.id,
      },
    });
  }
  async deleteMember(campaignId: string, email: string, curerntUser: ITokenPayload) {
    // checkowner
    await this.campaignService.checkOwner(campaignId, curerntUser);
    return await this.repository.teamMember.delete({
      email: email,
      campaign: {
        id: campaignId,
      },
    });
  }

  async editTeamMembers(
    currentUser: ITokenPayload,
    campaignId: string,
    updateTeamMemberDto: UpdateTeamMemberDto,
  ) {
    const campaign = await this.campaignService.checkOwner(campaignId, currentUser);
    const members = await this.repository.teamMember.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const memberDto = updateTeamMemberDto.members.find((item) => item.email === member.email);
      const { role, email, isEdit } = memberDto;
      await this.repository.teamMember.save({
        ...member,
        ...(role ? { role } : {}),
        ...(isEdit ? { isEdit } : {}),
      });
    }
  }
}
