import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const ReportRoute = {
  root: 'report',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  createReport: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getAllReportOfCurrentUser: <IRouteParams>{
    path: '/me',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default ReportRoute;
