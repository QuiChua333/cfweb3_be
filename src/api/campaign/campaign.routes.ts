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

  create: <IRouteParams>{
    path: '/new',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.User],
  },

  checkOwner: <IRouteParams>{
    path: '/:id/checkOwner',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default CampaignRoute;
