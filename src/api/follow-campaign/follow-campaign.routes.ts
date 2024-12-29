import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const FollowCampaignRoute = {
  root: 'follow-campaign',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getCampaignsFollowed: <IRouteParams>{
    path: '/user/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  follow: <IRouteParams>{
    path: '/follow',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getQuantityFollowsOfCampaign: <IRouteParams>{
    path: '/quantity/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default FollowCampaignRoute;
