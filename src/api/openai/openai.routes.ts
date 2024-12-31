import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';

const OpenAIRoute = {
  root: 'openai',

  moderateContent: <IRouteParams>{
    path: '/moderate',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: false,
  },
};

export default OpenAIRoute;
