import { Body, Controller, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import StatisticRoute from './statistic.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { StatisticCampaignTimeDto, StatisticMoneyTimeDto } from './dto';

@Controller(StatisticRoute.root)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @InjectRoute(StatisticRoute.meTotalCampaign)
  getStatisticTotalCampaignOfCurrentUser(@User() currentUser: ITokenPayload) {
    return this.statisticService.getStatisticTotalCampaignOfCurrentUser(currentUser);
  }

  @InjectRoute(StatisticRoute.meMoneyByTime)
  getStatisticMoneyOfCurrentUser(
    @User() currentUser: ITokenPayload,
    @Query() statisticMoneyTimeDto: StatisticMoneyTimeDto,
  ) {
    return this.statisticService.getStatisticMoneyOfCurrentUser(currentUser, statisticMoneyTimeDto);
  }

  @InjectRoute(StatisticRoute.meCampaignByTime)
  getStatisticCampaignByTimeOfCurrentUser(
    @User() currentUser: ITokenPayload,
    @Query() statisticTimeDto: StatisticCampaignTimeDto,
  ) {
    return this.statisticService.getStatisticCampaignByTimeOfCurrentUser(
      currentUser,
      statisticTimeDto,
    );
  }

  @InjectRoute(StatisticRoute.adminTotalCampaign)
  getStatisticTotalCampaignAdmin() {
    return this.statisticService.getStatisticTotalCampaignAdmin();
  }

  @InjectRoute(StatisticRoute.adminMoneyByTime)
  getStatisticMoneyAdmin(@Query() statisticMoneyTimeDto: StatisticMoneyTimeDto) {
    return this.statisticService.getStatisticMoneyAdmin(statisticMoneyTimeDto);
  }

  @InjectRoute(StatisticRoute.adminCampaignByTime)
  getStatisticCampaignByTimeAdmin(@Query() statisticTimeDto: StatisticCampaignTimeDto) {
    return this.statisticService.getStatisticCampaignByTimeAdmin(statisticTimeDto);
  }
}
