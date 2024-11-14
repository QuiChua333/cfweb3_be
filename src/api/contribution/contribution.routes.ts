import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const ContributionRoute = {
  root: 'contribution',

  getAllContributionsByCampaign: <IRouteParams>{
    path: '/campaign/:campaignId',
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

  paymentStripe: <IRouteParams>{
    path: '/payment/stripe',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  paymentMomo: <IRouteParams>{
    path: '/payment/momo',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  webhookStripe: <IRouteParams>{
    path: '/webhook/stripe',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  webhookMomo: <IRouteParams>{
    path: '/webhook/momo',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default ContributionRoute;
