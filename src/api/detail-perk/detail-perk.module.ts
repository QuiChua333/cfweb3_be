import { Module } from '@nestjs/common';
import { DetailPerkService } from './detail-perk.service';
import { DetailPerkController } from './detail-perk.controller';

@Module({
  controllers: [DetailPerkController],
  providers: [DetailPerkService],
})
export class DetailPerkModule {}
