import { RepositoryService } from '@/repositories/repository.service';
import { Injectable } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignStatus } from '@/constants';
import { StatisticTimeDto } from './dto';

@Injectable()
export class StatisticService {
  constructor(private readonly repository: RepositoryService) {}

  async getStatisticTotalCampaignOfCurrentUser(currentUser: ITokenPayload) {
    const queryBuilder = this.repository.campaign
      .createQueryBuilder('campaign')
      .andWhere('campaign.ownerId = :userId', { userId: currentUser.id })
      .andWhere('campaign.status IN (:...includedStatuses)', {
        includedStatuses: [CampaignStatus.FAILED, CampaignStatus.SUCCESS],
      });
    const campaigns = await queryBuilder.getMany();
    const success = campaigns.filter(
      (campaign) => campaign.status === CampaignStatus.SUCCESS,
    ).length;

    const failed = campaigns.filter((campaign) => campaign.status === CampaignStatus.FAILED).length;

    return {
      total: success + failed,
      success,
      failed,
    };
  }

  async getStatisticCampaignByTimeOfCurrentUser(
    currentUser: ITokenPayload,
    statisticTimeDto: StatisticTimeDto,
  ) {
    const { quarter: quarterStr, year: yearStr } = statisticTimeDto;
    const quarter = Number(quarterStr);
    const year = Number(yearStr);
    const startMonth = (quarter - 1) * 4 + 1;
    const endMonth = quarter * 4;
    const queryBuilder = this.repository.campaign
      .createQueryBuilder('campaign')
      .andWhere('campaign.ownerId = :userId', { userId: currentUser.id })
      .andWhere(
        'campaign.status NOT IN (:...excludedStatuses)',
        { excludedStatuses: [CampaignStatus.DRAFT, CampaignStatus.PENDING] }, // Exclude DRAFT and PENDING
      )
      .andWhere(
        `((EXTRACT(MONTH FROM campaign.publishedAt) BETWEEN :startMonth AND :endMonth 
          AND EXTRACT(YEAR FROM campaign.publishedAt) = :year) 
          OR (EXTRACT(MONTH FROM campaign.finishedAt) BETWEEN :startMonth AND :endMonth 
          AND EXTRACT(YEAR FROM campaign.finishedAt) = :year))`,
        { startMonth, endMonth, year },
      );
    const campaigns = await queryBuilder.getMany();

    const statistics = {
      published: [], // Mảng lưu trữ số lượng chiến dịch phát hành cho từng tháng
      success: [], // Mảng lưu trữ số lượng chiến dịch thành công cho từng tháng
      failed: [], // Mảng lưu trữ số lượng chiến dịch thất bại cho từng tháng
    };

    // Khởi tạo mảng cho số lượng chiến dịch ở mỗi tháng
    for (let month = startMonth; month <= endMonth; month++) {
      statistics.published.push(0);
      statistics.success.push(0);
      statistics.failed.push(0);
    }
    campaigns.forEach((campaign) => {
      const publishedMonth = campaign.publishedAt
        ? new Date(campaign.publishedAt).getMonth() + 1
        : null;
      const finishedMonth = campaign.finishedAt
        ? new Date(campaign.finishedAt).getMonth() + 1
        : null;

      // Tính số chiến dịch phát hành
      if (publishedMonth && publishedMonth >= startMonth && publishedMonth <= endMonth) {
        statistics.published[publishedMonth - startMonth]++;
      }

      // Tính số chiến dịch thành công và thất bại
      if (finishedMonth && finishedMonth >= startMonth && finishedMonth <= endMonth) {
        if (campaign.status === CampaignStatus.SUCCESS) {
          statistics.success[finishedMonth - startMonth]++;
        } else if (campaign.status === CampaignStatus.FAILED) {
          statistics.failed[finishedMonth - startMonth]++;
        }
      }
    });
    console.log(statistics);
    return statistics;
  }
}
