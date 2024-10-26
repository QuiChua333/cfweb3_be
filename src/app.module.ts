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

@Module({
  imports: [DatabaseModule, RepositoryModule, AuthModule, UserModule, EmailModule, FieldModule, UserVerifyModule, ItemModule, OptionModule, PerkModule, ReportResponseModule, ReportModule, ShippingFeeModule, TeamMemberModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
