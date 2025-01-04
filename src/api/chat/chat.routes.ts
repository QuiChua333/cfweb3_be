import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const ChatRoute = {
  root: 'chat',

  getHistoryChatList: <IRouteParams>{
    path: 'history/chat-list',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default ChatRoute;
