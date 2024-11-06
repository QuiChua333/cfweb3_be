import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const ContributionRoute = {
  root: 'contribution',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getTopContributionsByCampaign: <IRouteParams>{
    path: '/campaign/:campaignId/top-contributions',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getTotalMoneyByCampaign: <IRouteParams>{
    path: '/campaign/:campaignId/total-money',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getQuantityPeopleByCampaign: <IRouteParams>{
    path: '/campaign/:campaignId/quantity-people',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  editStatus: <IRouteParams>{
    path: '/:contributionId/status',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getQuantityContributionOfUser: <IRouteParams>{
    path: '/user/quantity',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default ContributionRoute;
