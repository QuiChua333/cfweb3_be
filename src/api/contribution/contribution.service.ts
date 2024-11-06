import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignService } from '../campaign/campaign.service';
import { UpdateContributionDto } from './dto';

@Injectable()
export class ContributionService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
  ) {}

  findAll() {
    return `This action returns all contribution`;
  }

  async getTopContributionsByCampaign(currenUser: ITokenPayload, campaignId: string) {
    const campaign = await this.campaignService.checkOwner(campaignId, currenUser);

    return this.repository.contribution
      .createQueryBuilder('contribution')
      .select('user.id', 'userId')
      .addSelect('user.email', 'email')
      .addSelect('SUM(contribution.amount)', 'totalAmount')
      .innerJoin('contribution.user', 'user')
      .where('contribution.campaign.id = :campaignId', { campaignId })
      .groupBy('user.id')
      .orderBy('totalAmount', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getTotalMoneyByCampaign(campaignId: string) {
    const result = await this.repository.contribution
      .createQueryBuilder('contribution')
      .select('SUM(contribution.amount)', 'totalAmount')
      .where('contribution.campaign.id = :campaignId', { campaignId })
      .getRawOne();

    return Number(result.totalAmount) || 0;
  }

  async getQuantityPeopleByCampaign(campaignId: string) {
    const [_, count] = await this.repository.contribution.findAndCount({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
    return count;
  }

  async editStatus(contributionId: string, updateContributionDto: UpdateContributionDto) {
    const contribution = await this.repository.contribution.findOneBy({ id: contributionId });
    contribution.isFinish = updateContributionDto.isFinish;
    return await this.repository.contribution.save(contribution);
  }

  async getQuantityContributionOfUser(currenUser: ITokenPayload) {
    const [_, count] = await this.repository.contribution.findAndCount({
      where: {
        user: {
          id: currenUser.id,
        },
      },
    });
    return count;
  }
}
