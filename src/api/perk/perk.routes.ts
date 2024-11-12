import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const PerkRoute = {
  root: 'perk',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  getPerksByCampaign: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getPerk: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  deletePerk: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  addPerk: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  editPerk: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getPerksContainItemsByCampaignId: <IRouteParams>{
    path: '/contain-items/campaign/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default PerkRoute;
