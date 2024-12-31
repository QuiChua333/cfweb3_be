import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';


const ChatRoute = {
  root: 'chat',

  getChatRooms: <IRouteParams>{
    path: '/rooms/:userId',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
  sendMessage: <IRouteParams>{
    path: '/message',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
  resetUnread: <IRouteParams>{
    path: '/unread/reset',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
  createChatRoom: <IRouteParams>{
    path: '/create',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default ChatRoute;
