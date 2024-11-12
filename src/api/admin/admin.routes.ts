import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const AdminRoute = {
  root: 'admin',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  checkAdmin: <IRouteParams>{
    path: '/check-admin',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },
};

export default AdminRoute;
