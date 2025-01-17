import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { FollowCampaignDto } from './dto';
import { CampaignPaginationDto, CampaignQueryStatus } from '../campaign/dto';

@Injectable()
export class FollowCampaignService {
  constructor(private readonly repository: RepositoryService) {}

  async getCampaignsFollowed(userId: string, campaignPaginationDto: CampaignPaginationDto) {
    const { status, searchString } = campaignPaginationDto;
    // const followedCampaigns = await this.repository.followCampaign.find({
    //   where: {
    //     user: {
    //       id: userId,
    //     },
    //   },
    //   relations: {
    //     campaign: {
    //       owner: true,
    //     },
    //   },
    // });

    // return followedCampaigns.map((item) => item.campaign);
    const query = this.repository.followCampaign
      .createQueryBuilder('followCampaign')
      .leftJoinAndSelect('followCampaign.campaign', 'campaign')
      .leftJoinAndSelect('campaign.owner', 'owner')
      .where('followCampaign.userId = :userId', { userId });

    // Tìm kiếm theo chuỗi
    if (searchString && searchString.trim() !== '') {
      query.andWhere(
        '(campaign.title ILIKE :searchString OR owner.email ILIKE :searchString OR owner.fullName ILIKE :searchString)',
        {
          searchString: `%${searchString}%`,
        },
      );
    }

    // Tìm kiếm theo trạng thái
    if (status && status !== CampaignQueryStatus.ALL) {
      query.andWhere('campaign.status = :status', { status });
    }

    // Thực hiện truy vấn
    const followedCampaigns = await query.getMany();

    // Định dạng kết quả trả về
    return {
      campaigns: followedCampaigns.map((item) => item.campaign),
    };
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
