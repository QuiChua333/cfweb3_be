import { RepositoryService } from '@/repositories/repository.service';
import { Injectable } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignStatus, PaymentStatus } from '@/constants';
import { StatisticCampaignTimeDto, StatisticMoneyTimeDto } from './dto';

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
    statisticTimeDto: StatisticCampaignTimeDto,
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

    return statistics;
  }

  async getStatisticMoneyOfCurrentUser(
    currentUser: ITokenPayload,
    statisticTimeDto: StatisticMoneyTimeDto,
  ) {
    const { year: yearStr } = statisticTimeDto;
    const year = Number(yearStr);

    const statistics = await Promise.all(
      Array.from({ length: 12 }, async (_, index) => {
        const month = index + 1;

        // Tổng tiền đóng góp
        const totalContributed = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount)', 'total')
          .where('contribution.userId = :userId', { userId: currentUser.id })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        // Tổng tiền được mọi người đóng góp
        const totalReceivedFromOthers = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount)', 'total')
          .innerJoin('contribution.campaign', 'campaign')
          .where('campaign.ownerId = :ownerId', { ownerId: currentUser.id })
          .andWhere('contribution.userId != :userId', { userId: currentUser.id })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        // Tổng số tiền nhận được từ dự án
        const totalProjectEarnings = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount) * 0.95', 'total')
          .innerJoin('contribution.campaign', 'campaign')
          .where('campaign.ownerId = :ownerId', { ownerId: currentUser.id })
          .andWhere('campaign.status = :campaignStatus', { campaignStatus: CampaignStatus.SUCCESS })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('campaign.isSend = :isSend', { isSend: true })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        // Tổng số tiền được hoàn trả
        const totalRefunded = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount) * 0.95', 'total')
          .where('contribution.userId = :userId', { userId: currentUser.id })
          .andWhere('contribution.isRefund = :isRefund', { isRefund: true })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        const response = {
          month,
          totalContributed: Number(totalContributed?.total) || 0,
          totalReceivedFromOthers: Number(totalReceivedFromOthers?.total) || 0,
          totalProjectEarnings: Number(totalProjectEarnings?.total) || 0,
          totalRefunded: Number(totalRefunded?.total) || 0,
        };

        return response;
      }),
    );

    const result = statistics.reduce(
      (acc, stat) => {
        acc.contributed.push(stat.totalContributed);
        acc.receivedFromOthers.push(stat.totalReceivedFromOthers);
        acc.projectEarnings.push(stat.totalProjectEarnings);
        acc.refunded.push(stat.totalRefunded);
        acc.sumContributed += stat.totalContributed;
        acc.sumReceivedFromOthers += stat.totalReceivedFromOthers;
        acc.sumProjectEarnings += stat.totalProjectEarnings;
        acc.sumRefunded += stat.totalRefunded;
        return acc;
      },
      {
        contributed: [],
        receivedFromOthers: [],
        projectEarnings: [],
        refunded: [],
        sumContributed: 0,
        sumReceivedFromOthers: 0,
        sumProjectEarnings: 0,
        sumRefunded: 0,
      },
    );

    return result;
  }

  async getStatisticTotalCampaignAdmin() {
    const queryBuilder = this.repository.campaign
      .createQueryBuilder('campaign')
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

  async getStatisticCampaignByTimeAdmin(statisticTimeDto: StatisticCampaignTimeDto) {
    const { quarter: quarterStr, year: yearStr } = statisticTimeDto;
    const quarter = Number(quarterStr);
    const year = Number(yearStr);
    const startMonth = (quarter - 1) * 4 + 1;
    const endMonth = quarter * 4;
    const queryBuilder = this.repository.campaign
      .createQueryBuilder('campaign')
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

    return statistics;
  }

  async getStatisticMoneyAdmin(statisticTimeDto: StatisticMoneyTimeDto) {
    const { year: yearStr } = statisticTimeDto;
    const year = Number(yearStr);

    const statistics = await Promise.all(
      Array.from({ length: 12 }, async (_, index) => {
        const month = index + 1;

        // Tổng tiền được mọi người đóng góp
        const totalReceivedFromOthers = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount)', 'total')
          .innerJoin('contribution.campaign', 'campaign')
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        // Tổng số tiền nhận được từ dự án
        const totalProjectEarnings = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount) * 0.05', 'total')
          .innerJoin('contribution.campaign', 'campaign')
          .andWhere('campaign.status = :campaignStatus', { campaignStatus: CampaignStatus.SUCCESS })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('campaign.isSend = :isSend', { isSend: true })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        const totalProjectEarningsRefund = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount) * 0.05', 'total')
          .andWhere('contribution.isRefund = :isRefund', { isRefund: true })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        // Tổng số tiền phải hoàn trả
        const totalRefunded = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount) * 0.95', 'total')
          .andWhere('contribution.isRefund = :isRefund', { isRefund: true })
          .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
          .andWhere('EXTRACT(YEAR FROM contribution.date) = :year', { year })
          .andWhere('EXTRACT(MONTH FROM contribution.date) = :month', { month })
          .getRawOne();

        const response = {
          month,

          totalReceivedFromOthers: Number(totalReceivedFromOthers?.total) || 0,
          totalProjectEarnings:
            (Number(totalProjectEarnings?.total) || 0) +
            (Number(totalProjectEarningsRefund?.total) || 0),
          totalRefunded: Number(totalRefunded?.total) || 0,
        };

        return response;
      }),
    );

    const result = statistics.reduce(
      (acc, stat) => {
        acc.receivedFromOthers.push(stat.totalReceivedFromOthers);
        acc.projectEarnings.push(stat.totalProjectEarnings);
        acc.refunded.push(stat.totalRefunded);

        acc.sumReceivedFromOthers += stat.totalReceivedFromOthers;
        acc.sumProjectEarnings += stat.totalProjectEarnings;
        acc.sumRefunded += stat.totalRefunded;
        return acc;
      },
      {
        contributed: [],
        receivedFromOthers: [],
        projectEarnings: [],
        refunded: [],
        sumContributed: 0,
        sumReceivedFromOthers: 0,
        sumProjectEarnings: 0,
        sumRefunded: 0,
      },
    );

    return result;
  }
}
