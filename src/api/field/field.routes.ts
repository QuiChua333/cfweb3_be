import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const FieldRoute = {
  root: 'field',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.Admin],
  },

  getFieldsGroupByCategory: <IRouteParams>{
    path: 'group-by-category',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },
};

export default FieldRoute;
