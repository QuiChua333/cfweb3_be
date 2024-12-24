import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/auth/auth.module';
import { UserModule } from '@/api/user/user.module';
import { AppController } from '@/app.controller';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './services/email/email.module';
import { RepositoryModule } from './repositories/repository.module';
import { FieldModule } from './api/field/field.module';
import { UserVerifyModule } from './api/user-verify/user-verify.module';
import { ItemModule } from './api/item/item.module';
import { OptionModule } from './api/option/option.module';
import { PerkModule } from './api/perk/perk.module';
import { ReportResponseModule } from './api/report-response/report-response.module';
import { ReportModule } from './api/report/report.module';
import { ShippingFeeModule } from './api/shipping-fee/shipping-fee.module';
import { TeamMemberModule } from './api/team-member/team-member.module';
import { CampaignModule } from './api/campaign/campaign.module';
import { CommentLikeModule } from './api/comment-like/comment-like.module';
import { CommentModule } from './api/comment/comment.module';
import { ContributionModule } from './api/contribution/contribution.module';
import { DetailPerkModule } from './api/detail-perk/detail-perk.module';
import { FaqModule } from './api/faq/faq.module';
import { FieldGroupModule } from './api/field-group/field-group.module';
import { FollowCampaignModule } from './api/follow-campaign/follow-campaign.module';
import { CloudinaryModule } from './services/cloudinary/cloudinary.module';
import { GiftModule } from './api/gift/gift.module';
import { AdminModule } from './api/admin/admin.module';
import { NftModule } from './api/nft/nft.module';
import { Web3Module } from './services/web3/web3.module';
import { PinataModule } from './services/pinata/pinata.module';
import { ScheduleModule } from './services/schedule/schedule.module';

@Module({
  imports: [
    DatabaseModule,
    RepositoryModule,
    AuthModule,
    UserModule,
    EmailModule,
    FieldModule,
    UserVerifyModule,
    ItemModule,
    OptionModule,
    PerkModule,
    ReportResponseModule,
    ReportModule,
    ShippingFeeModule,
    TeamMemberModule,
    CampaignModule,
    CommentLikeModule,
    CommentModule,
    ContributionModule,
    DetailPerkModule,
    FaqModule,
    FieldGroupModule,
    FollowCampaignModule,
    CloudinaryModule,
    GiftModule,
    AdminModule,
    NftModule,
    Web3Module,
    PinataModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
