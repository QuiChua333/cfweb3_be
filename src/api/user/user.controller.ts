import { Body, Controller, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRoute, User } from '@/decorators';
import UserRoute from '@/api/user/user.routes';
import { ITokenPayload } from '../auth/auth.interface';
import { UpdateProfileUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(UserRoute.root)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectRoute(UserRoute.findAll)
  findAll() {
    return this.userService.findAll();
  }

  @InjectRoute(UserRoute.findMe)
  findMe(@User() user: ITokenPayload) {
    const { id } = user;
    return this.userService.findOneById(id);
  }

  @InjectRoute(UserRoute.getUserByEmail)
  getUserByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @InjectRoute(UserRoute.getUserById)
  getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @InjectRoute(UserRoute.updateProfile)
  @UseInterceptors(FileInterceptor('file'))
  updateProfile(
    @User() user: ITokenPayload,
    @Body() updateProfileUserDto: UpdateProfileUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(user, updateProfileUserDto, file);
  }
}
