import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const CampaignRoute = {
  root: 'campaign',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  createCampaign: <IRouteParams>{
    path: '/new',
    method: RequestMethod.POST,
    code: HttpStatus.CREATED,
    jwtSecure: true,
    roles: [Role.User],
  },

  checkOwner: <IRouteParams>{
    path: '/:id/checkOwner',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  editCampaign: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  launchCampaign: <IRouteParams>{
    path: '/:id/launch',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default CampaignRoute;
