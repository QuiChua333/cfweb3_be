import { CampaignStatus, PaymentStatus } from '@/constants';
import { RepositoryService } from '@/repositories/repository.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly emailService: EmailService,
  ) {}
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
        .select('SUM(contribution.amount)', 'totalAmount')
        .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
        .andWhere('contribution.status = :status', { status: PaymentStatus.SUCCESS })
        .getRawOne();
      const totalAmount = Number(result?.totalAmount || 0);
      if (totalAmount < campaign.goal) {
        campaign.status = CampaignStatus.FAILED;
      } else {
        campaign.status = CampaignStatus.SUCCESS;
      }

      await this.repositoryService.campaign.save(campaign);

      const contributions = await this.repositoryService.contribution.find({
        where: { campaign: { id: campaign.id } },
        relations: ['user'],
      });

      // const contributionsDistinctWithEmail = await this.repositoryService.contribution
      //   .createQueryBuilder('contribution')
      //   .where('contribution.status = :status', { status: 'Thành công' })
      //   .andWhere('contribution.campaign = :campaignId', { campaignId: campaign.id })
      //   .select('DISTINCT contribution.email') // Chọn các email duy nhất
      //   .getRawMany();

      // Chuyển kết quả thành mảng các email
      const emails = contributions.map((contribution) => contribution.email);

      if (campaign.status === CampaignStatus.FAILED) {
        this.emailService.sendCampaignFailureNotificationEmail(emails, campaign.title);
      } else if (campaign.status === CampaignStatus.SUCCESS) {
        this.emailService.sendCampaignSuccessNotificationEmail(emails, campaign.title);
      }
    }

    this.logger.log(`Expired campaigns updated: ${campaignsToExpire.length}`);
  }
}
