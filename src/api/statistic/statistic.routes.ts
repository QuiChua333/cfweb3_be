import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const StatisticRoute = {
  root: 'statistic',

  meTotalCampaign: <IRouteParams>{
    path: '/me/total-campaign',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  meCampaignByTime: <IRouteParams>{
    path: '/me/campaign-by-time',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default StatisticRoute;
