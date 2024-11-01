import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CampaignService } from '../campaign/campaign.service';
import { ITokenPayload } from '../auth/auth.interface';
import { InvitateMemberDto } from './dto';

@Injectable()
export class TeamMemberService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
  ) {}

  async getTeamMemberByCampaignId(campaignId: string) {
    const campaign = await this.campaignService.findOneById(campaignId);
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    return this.repository.teamMember.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: ['user'],
      select: {
        user: {
          avatar: true,
          email: true,
        },
      },
    });
  }

  async invitateMember(
    campaignId: string,
    invitateMemberDto: InvitateMemberDto,
    user: ITokenPayload,
  ) {
    // checkowner
    await this.campaignService.checkOwner(campaignId, user);
    const { email, isEdit } = invitateMemberDto;
    const invitatedUser = await this.repository.user.findOne({
      where: {
        email: email,
      },
    });
    let invitatedUserId: string;
    if (invitatedUser && invitatedUser.isVerifiedEmail) {
      invitatedUserId = invitatedUser.id;
    }
    await this.repository.teamMember.save({
      campaign: {
        id: campaignId,
      },
      isEdit,
      user: {
        id: invitatedUserId,
      },
    });
  }

  async deleteMember(campaignId: string, userId: string, curerntUser: ITokenPayload) {
    // checkowner
    await this.campaignService.checkOwner(campaignId, curerntUser);
    return await this.repository.teamMember.delete({
      user: {
        id: userId,
      },
      campaign: {
        id: campaignId,
      },
    });
  }
}
