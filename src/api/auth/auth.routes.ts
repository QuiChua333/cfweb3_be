import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const AuthRoute = {
  root: 'auth',
  register: <IRouteParams>{
    path: '/register',
    method: RequestMethod.POST,
    code: HttpStatus.CREATED,
    jwtSecure: false,
  },
  login: <IRouteParams>{
    path: '/login',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  logout: <IRouteParams>{
    path: '/logout',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  refreshToken: <IRouteParams>{
    path: '/refreshToken',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
    jwtRefresh: true,
  },

  googleLogin: <IRouteParams>{
    path: '/google/login',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
    googleOAuth: true,
  },

  googleCallback: <IRouteParams>{
    path: '/google/callback',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
    googleOAuth: true,
  },
};

export default AuthRoute;
