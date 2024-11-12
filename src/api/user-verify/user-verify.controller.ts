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
  UploadedFiles,
} from '@nestjs/common';
import { UserVerifyService } from './user-verify.service';
import UserVerifyRoute from './user-verify.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { RequestVerifyUserDto, UpdateVerifyUserDto } from './dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor('files', 2))
  requestVerifyUser(
    @User() currentUser: ITokenPayload,
    @Body() requestVerifyUserDto: RequestVerifyUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.userVerifyService.requestVerifyUser(currentUser, requestVerifyUserDto, files);
  }

  @InjectRoute(UserVerifyRoute.updateVerifyUser)
  @UseInterceptors(FilesInterceptor('files', 2))
  updateVerifyUser(
    @User() currentUser: ITokenPayload,
    @Body() updateVerifyUserDto: UpdateVerifyUserDto,
    @Body('filePresence') filePresence: string[],
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.userVerifyService.updateVerifyUser(
      currentUser,
      updateVerifyUserDto,
      files,
      filePresence,
    );
  }

  @InjectRoute(UserVerifyRoute.adminVerify)
  adminVerify(@Param('userId') userId: string) {
    return this.userVerifyService.adminVerify(userId);
  }
}
