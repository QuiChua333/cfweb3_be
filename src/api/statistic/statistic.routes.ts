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

  meMoneyByTime: <IRouteParams>{
    path: '/me/money-by-time',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  adminTotalCampaign: <IRouteParams>{
    path: '/admin/total-campaign',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  adminCampaignByTime: <IRouteParams>{
    path: '/admin/campaign-by-time',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  adminMoneyByTime: <IRouteParams>{
    path: '/admin/money-by-time',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },
};

export default StatisticRoute;
