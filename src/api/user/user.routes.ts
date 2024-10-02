import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const UserRoute = {
  root: 'user',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  findMe: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default UserRoute;
