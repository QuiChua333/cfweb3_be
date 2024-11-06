import { Controller } from '@nestjs/common';
import { DetailPerkService } from './detail-perk.service';
import DetailPerkRoute from './detail-perk.routes';
import { InjectRoute } from '@/decorators';

@Controller(DetailPerkRoute.root)
export class DetailPerkController {
  constructor(private readonly detailPerkService: DetailPerkService) {}

  @InjectRoute(DetailPerkRoute.findAll)
  findAll() {
    return this.detailPerkService.findAll();
  }
}
