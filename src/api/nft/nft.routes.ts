import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const NftRoute = {
  root: 'nft',

  createNFT: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getNumber: <IRouteParams>{
    path: '/getNumber',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  setNumber: <IRouteParams>{
    path: '/setNumber',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default NftRoute;
