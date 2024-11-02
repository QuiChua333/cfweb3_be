import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { FollowCampaignDto } from './dto';

@Injectable()
export class FollowCampaignService {
  constructor(private readonly repository: RepositoryService) {}

  async getCampaignsFollowed(user: ITokenPayload) {
    const userId = user.id;
    const followedCampaigns = await this.repository.followCampaign.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['campaign'],
    });
    return followedCampaigns;
  }

  async follow(user: ITokenPayload, followCampaignDto: FollowCampaignDto) {
    const userId = user.id;
    const campaignId = followCampaignDto.campaignId;
    const existedFollower = await this.repository.followCampaign.findOne({
      where: {
        campaign: {
          id: campaignId,
        },
        user: {
          id: userId,
        },
      },
    });

    if (existedFollower) {
      return await this.repository.followCampaign.remove(existedFollower);
    } else {
      return await this.repository.followCampaign.save({
        user: {
          id: userId,
        },
        campaign: {
          id: campaignId,
        },
      });
    }
  }
}
