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
};

export default NftRoute;
