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

  getCampaignsExplore: <IRouteParams>{
    path: '/explore',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getCampaignsExplore2: <IRouteParams>{
    path: '/explore2',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getPopularCampaigns: <IRouteParams>{
    path: '/popularity',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getCampaignById: <IRouteParams>{
    path: '/id/:id',
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
    jwtSecure: false,
  },

  getCampaignsOfMember: <IRouteParams>{
    path: '/member/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getQuantityCampaignsOfOwner: <IRouteParams>{
    path: '/quantity/owner/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getQuantityCampaignsOfUser: <IRouteParams>{
    path: '/quantity/user/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getCampaignsOfUser: <IRouteParams>{
    path: '/user/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  CKEUpload: <IRouteParams>{
    path: '/CKEUpload',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  adminChangeStatus: <IRouteParams>{
    path: '/admin-change-status/:campaignId',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  getQuantitySuccessCampaignByCampaignId: <IRouteParams>{
    path: '/quantity-success/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  getQuantitySuccessCampaignOfUser: <IRouteParams>{
    path: '/quantity-success/user/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default CampaignRoute;
