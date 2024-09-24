import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRoute, ReqUser } from '@/decorators';
import UserRoute from '@/api/user/user.routes';
import { ICurrentUser } from '@/api/auth/interfaces';

@Controller(UserRoute.root)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectRoute(UserRoute.getAllUsers)
  getAllUsers() {
    return this.userService.findAll();
  }

  @InjectRoute(UserRoute.getCurrentUser)
  findAll(@ReqUser() reqUser: ICurrentUser) {
    const { id } = reqUser;
    return this.userService.findOne(id);
  }
}
