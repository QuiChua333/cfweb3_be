import { Body, Controller, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import StatisticRoute from './statistic.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { StatisticTimeDto } from './dto';

@Controller(StatisticRoute.root)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @InjectRoute(StatisticRoute.meTotalCampaign)
  getStatisticTotalCampaignOfCurrentUser(@User() currentUser: ITokenPayload) {
    return this.statisticService.getStatisticTotalCampaignOfCurrentUser(currentUser);
  }

  @InjectRoute(StatisticRoute.meCampaignByTime)
  getStatisticCampaignByTimeOfCurrentUser(
    @User() currentUser: ITokenPayload,
    @Query() statisticTimeDto: StatisticTimeDto,
  ) {
    return this.statisticService.getStatisticCampaignByTimeOfCurrentUser(
      currentUser,
      statisticTimeDto,
    );
  }
}
