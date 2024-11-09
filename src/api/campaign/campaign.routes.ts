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

  getCampaignById: <IRouteParams>{
    path: '/:id',
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
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  launchCampaign: <IRouteParams>{
    path: '/:id/launch',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  deleteCampaign: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getCampaignsOfOwner: <IRouteParams>{
    path: '/owner/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getQuantityCampaignsOfOwner: <IRouteParams>{
    path: '/quantity/owner/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getCampaignsOfUser: <IRouteParams>{
    path: '/user/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getQuantityCampaignsOfUser: <IRouteParams>{
    path: '/quantity/user/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getPopulateCampaigns: <IRouteParams>{
    path: '/populate',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  CKEUpload: <IRouteParams>{
    path: '/CKEUpload',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default CampaignRoute;
