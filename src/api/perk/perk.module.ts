import { Module } from '@nestjs/common';
import { PerkService } from './perk.service';
import { PerkController } from './perk.controller';

@Module({
  controllers: [PerkController],
  providers: [PerkService],
})
export class PerkModule {}
