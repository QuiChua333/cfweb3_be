import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { FollowCampaignDto } from './dto';

@Injectable()
export class FollowCampaignService {
  constructor(private readonly repository: RepositoryService) {}

  async getCampaignsFollowed(userId: string) {
    const followedCampaigns = await this.repository.followCampaign.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        campaign: {
          owner: true,
        },
      },
    });

    return followedCampaigns.map((item) => item.campaign);
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

  async getQuantityFollowsOfCampaign(id: string) {
    const quantity = await this.repository.followCampaign.count({
      where: {
        campaign: {
          id,
        },
      },
    });

    return quantity;
  }
}
