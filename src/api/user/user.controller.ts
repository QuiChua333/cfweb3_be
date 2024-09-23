import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRoute, ReqUser } from '@/decorators';
import UserRoute from '@/api/user/user.routes';
import { ICurrentUser } from '@/api/auth/interfaces';

@Controller(UserRoute.name)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectRoute(UserRoute.getAllStudent)
  findAll(@ReqUser() reqUser: ICurrentUser) {
    console.log(reqUser);
    return this.userService.findAll();
  }
}
