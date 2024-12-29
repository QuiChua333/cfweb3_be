import { CampaignStatus } from '@/constants';
import { RepositoryService } from '@/repositories/repository.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  constructor(private readonly repositoryService: RepositoryService) {}
  private readonly logger = new Logger(ScheduleService.name);

  @Cron('0 */30 * * * *')
  async checkCampaignExpiration() {
    this.logger.log('Checking for expired campaigns...');

    const now = new Date(); // Lấy thời điểm hiện tại

    const expiredCampaigns = await this.repositoryService.campaign.find({
      where: {
        status: CampaignStatus.FUNDING,
      },
    });

    const campaignsToExpire = expiredCampaigns.filter((campaign) => {
      const expirationDate = new Date(campaign.publishedAt);
      expirationDate.setMinutes(expirationDate.getMinutes() + campaign.duration * 24 * 60); // Tính số phút hết hạn từ duration (ngày)
      return expirationDate <= now; // So sánh với thời điểm hiện tại
    });

    // Cập nhật trạng thái các chiến dịch hết hạn
    for (const campaign of campaignsToExpire) {
      const result = await this.repositoryService.contribution
        .createQueryBuilder('contribution')
        .select('SUM(contribution.amount)', 'total')
        .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
        .getRawOne();
      const totalAmount = result.totalAmount ? Number(result.totalAmount) : 0;
      if (totalAmount < campaign.goal) {
        campaign.status = CampaignStatus.FAILED;
      } else {
        campaign.status = CampaignStatus.COMPLETE;
      }

      await this.repositoryService.campaign.save(campaign);
    }

    this.logger.log(`Expired campaigns updated: ${campaignsToExpire.length}`);
  }
}
