import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const UserRoute = {
  root: 'user',

  getAll: <IRouteParams>{
    path: '/getAll',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  findMe: <IRouteParams>{
    path: '/findMe',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getUserByEmail: <IRouteParams>{
    path: '/email/:email',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  getUserById: <IRouteParams>{
    path: '/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  updateProfile: <IRouteParams>{
    path: '/profile',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  changeStatus: <IRouteParams>{
    path: '/change-status/:userId',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },
};

export default UserRoute;
