import { Module } from '@nestjs/common';
import { AuthModule } from '@/api/auth/auth.module';
import { UserModule } from '@/api/user/user.module';
import { AppController } from '@/app.controller';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './services/email/email.module';
import { RepositoryModule } from './repositories/repository.module';
import { CampaignModule } from './api/campaign/campaign.module';
import { CommentLikeModule } from './api/comment-like/comment-like.module';
import { CommentModule } from './api/comment/comment.module';
import { ContributionModule } from './api/contribution/contribution.module';
import { DetailPerkModule } from './api/detail-perk/detail-perk.module';
import { FaqModule } from './api/faq/faq.module';
import { FieldGroupModule } from './api/field-group/field-group.module';
import { FollowCampaignModule } from './api/follow-campaign/follow-campaign.module';

@Module({
  imports: [DatabaseModule, RepositoryModule, AuthModule, UserModule, EmailModule, CampaignModule, CommentLikeModule, CommentModule, ContributionModule, DetailPerkModule, FaqModule, FieldGroupModule, FollowCampaignModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
