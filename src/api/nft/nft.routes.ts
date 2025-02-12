import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const NftRoute = {
  root: 'nft',

  createNFT: <IRouteParams>{
    path: '/create',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  mintNFT: <IRouteParams>{
    path: '/mint',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
  },

  getNFTsByCampaign: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
  getNFTOfCurrentUser: <IRouteParams>{
    path: '/current-user',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
  getNFT: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },
};

export default NftRoute;
