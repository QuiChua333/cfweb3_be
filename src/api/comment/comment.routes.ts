import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const CommentRoute = {
  root: 'comment',

  findAll: <IRouteParams>{
    path: '/',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  createComment: <IRouteParams>{
    path: '/',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  validateComment: <IRouteParams>{
    path: '/validate',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  deleteComment: <IRouteParams>{
    path: '/:commentId',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  updateComment: <IRouteParams>{
    path: '/:commentId',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },

  getCommentsByCampaignId: <IRouteParams>{
    path: '/campaign/:campaignId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default CommentRoute;
