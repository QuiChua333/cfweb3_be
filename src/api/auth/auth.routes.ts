import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const AuthRoute = {
  root: 'auth',
  register: <IRouteParams>{
    path: '/register',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default AuthRoute;
