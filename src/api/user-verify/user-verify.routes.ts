import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const UserVerifyRoute = {
  root: 'user-verify',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  getInfoVerifyUser: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  requestVerifyUser: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  updateVerifyUser: <IRouteParams>{
    path: '/',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  adminVerify: <IRouteParams>{
    path: '/admin-verify/:userId',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },
};

export default UserVerifyRoute;
