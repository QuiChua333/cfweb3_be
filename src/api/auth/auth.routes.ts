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
    path: '/refresh-token',
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

  forgotPassword: <IRouteParams>{
    path: '/forgot-password',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  resetPassword: <IRouteParams>{
    path: '/reset-password',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  resendEmailConfirm: <IRouteParams>{
    path: '/resend-email-confirm',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  confirmEmail: <IRouteParams>{
    path: '/confirm-email',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  updatePasswordBaseOldPassword: <IRouteParams>{
    path: '/user/:id',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default AuthRoute;
