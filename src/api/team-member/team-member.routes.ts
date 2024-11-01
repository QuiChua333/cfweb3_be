import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const TeamMemberRoute = {
  root: 'team-member',

  getTeamMemberByCampaignId: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
  },

  invitateMember: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.User],
  },

  deleteMember: <IRouteParams>{
    path: '/campaign/:campaignId/:userId',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.User],
  },
};

export default TeamMemberRoute;
