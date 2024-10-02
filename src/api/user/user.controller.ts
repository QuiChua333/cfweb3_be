import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRoute, User } from '@/decorators';
import UserRoute from '@/api/user/user.routes';
import { ICurrentUser } from '@/api/auth/auth.interface';

@Controller(UserRoute.root)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectRoute(UserRoute.findAll)
  findAll() {
    return this.userService.findAll();
  }

  @InjectRoute(UserRoute.findMe)
  findMe(@User() user: ICurrentUser) {
    const { id } = user;
    return this.userService.findOneById(id);
  }
}
