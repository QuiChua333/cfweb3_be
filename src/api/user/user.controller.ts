import { Body, Controller, Param, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRoute, User } from '@/decorators';
import UserRoute from '@/api/user/user.routes';
import { ITokenPayload } from '../auth/auth.interface';
import { UpdateProfileUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserPaginationDto } from './dto/user-pagination.dto';

@Controller(UserRoute.root)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @InjectRoute(UserRoute.getAll)
  getAll() {
    return this.userService.getAll();
  }

  @InjectRoute(UserRoute.findAll)
  findAll(@Query() userPaginationDto: UserPaginationDto) {
    return this.userService.findAll(userPaginationDto);
  }

  @InjectRoute(UserRoute.findMe)
  findMe(@User() user: ITokenPayload) {
    const { id } = user;
    return this.userService.findOneDetail(id);
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

  @InjectRoute(UserRoute.changeStatus)
  changeStatus(@Param('userId') userId: string) {
    return this.userService.changeStatus(userId);
  }
}
