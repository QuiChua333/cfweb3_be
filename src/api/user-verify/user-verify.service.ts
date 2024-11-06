import { BadRequestException, Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { UserService } from '../user/user.service';
import { Role, VerifyStatus } from '@/constants';
import { RequestVerifyUserDto } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Injectable()
export class UserVerifyService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return `This action returns all userVerify`;
  }

  async getInfoVerifyUser(currentUser: ITokenPayload, verifyUserId: string) {
    const verifyUser = await this.userService.findOneById(verifyUserId);
    if (currentUser.role !== Role.Admin && currentUser.id !== verifyUserId)
      throw new BadRequestException('Không có quyền truy cập tài nguyên');
    return await this.repository.userVerify.findOne({
      where: {
        user: {
          id: verifyUserId,
        },
      },
    });
  }

  async requestVerifyUser(
    currentUser: ITokenPayload,
    requestVerifyUserDto: RequestVerifyUserDto,
    file: Express.Multer.File,
  ) {
    const userVerify = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });

    if (userVerify) {
      if (file) {
        const url = userVerify.identifyCardImage;
        if (url) {
          await this.cloudinaryService.destroyFile(url);
        }
        const res = await this.cloudinaryService.uploadFile(file);
        const identifyCardImage = res.secure_url as string;
        requestVerifyUserDto['identifyCardImage'] = identifyCardImage;
      }
    } else {
      if (file) {
        const res = await this.cloudinaryService.uploadFile(file);
        const identifyCardImage = res.secure_url as string;
        requestVerifyUserDto['identifyCardImage'] = identifyCardImage;
      }
    }
    await this.repository.userVerify.save({
      ...requestVerifyUserDto,
      isNew: true,
    });

    await this.userService.updateVerifyStatus(currentUser.id, VerifyStatus.PENDING);

    return requestVerifyUserDto;
  }
}
