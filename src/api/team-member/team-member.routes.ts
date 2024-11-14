import { HttpStatus, RequestMethod } from '@nestjs/common';

import type { IRouteParams } from '@/decorators';
import { Role } from '@/constants';

const TeamMemberRoute = {
  root: 'team-member',

  getTeamMemberByCampaignId: <IRouteParams>{
    path: '/campaign/:id',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  invitateMember: <IRouteParams>{
    path: '/campaign/:campaignId',
    method: RequestMethod.POST,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.User],
  },

  deleteMember: <IRouteParams>{
    path: '/campaign/:campaignId/:email',
    method: RequestMethod.DELETE,
    code: HttpStatus.OK,
    jwtSecure: true,
    roles: [Role.User],
  },

  confirmInvitation: <IRouteParams>{
    path: '/confirm',
    method: RequestMethod.GET,
    code: HttpStatus.OK,
    jwtSecure: false,
  },

  editTeamMembers: <IRouteParams>{
    path: '/campaign/:campaignId',
    method: RequestMethod.PATCH,
    code: HttpStatus.OK,
    jwtSecure: true,
  },
};

export default TeamMemberRoute;
