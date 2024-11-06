import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const ItemRoute = {
  root: 'item',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  getItemsByCampaign: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  addItem: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  editItem: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  deleteItem: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getItemsContainPerksByCampaignId: <IRouteParams>{
    path: '/campaign/:campaignId/contain-perk',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getItemContainPerks: <IRouteParams>{
    path: '/:id/contain-perk',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default ItemRoute;
