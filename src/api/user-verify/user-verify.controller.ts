import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserVerifyService } from './user-verify.service';
import UserVerifyRoute from './user-verify.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { RequestVerifyUserDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(UserVerifyRoute.root)
export class UserVerifyController {
  constructor(private readonly userVerifyService: UserVerifyService) {}

  @InjectRoute(UserVerifyRoute.findAll)
  findAll() {
    return this.userVerifyService.findAll();
  }

  @InjectRoute(UserVerifyRoute.getInfoVerifyUser)
  getInfoVerifyUser(@User() currentUser: ITokenPayload, @Param('id') verifyUserId: string) {
    return this.userVerifyService.getInfoVerifyUser(currentUser, verifyUserId);
  }

  @InjectRoute(UserVerifyRoute.requestVerifyUser)
  @UseInterceptors(FileInterceptor('file'))
  requestVerifyUser(
    @User() currentUser: ITokenPayload,
    @Body() requestVerifyUserDto: RequestVerifyUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userVerifyService.requestVerifyUser(currentUser, requestVerifyUserDto, file);
  }
}
