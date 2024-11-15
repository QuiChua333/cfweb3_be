import { Module } from '@nestjs/common';
import { GiftService } from './gift.service';
import { GiftController } from './gift.controller';
import { EmailModule } from '@/services/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [GiftController],
  providers: [GiftService],
})
export class GiftModule {}
