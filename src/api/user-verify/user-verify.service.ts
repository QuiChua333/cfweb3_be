import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { UserService } from '../user/user.service';
import { Role, VerifyStatus } from '@/constants';
import { RequestVerifyUserDto, UpdateVerifyUserDto } from './dto';
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
    if (currentUser.role !== Role.Admin && currentUser.id !== verifyUserId)
      throw new BadRequestException('Không có quyền truy cập tài nguyên');
    const info = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: verifyUserId,
        },
      },
    });
    const user = await this.userService.findOneById(verifyUserId);
    return {
      ...info,
      verifyStatus: user.verifyStatus,
    };
  }

  async requestVerifyUser(
    currentUser: ITokenPayload,
    requestVerifyUserDto: RequestVerifyUserDto,
    files: Express.Multer.File[],
  ) {
    const user = await this.userService.findOneById(currentUser.id);
    if (user.verifyStatus === VerifyStatus.SUCCESS)
      throw new BadRequestException('Tài khoản đã được xác minh');
    const userVerify = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });
    if (userVerify) throw new BadRequestException('Tài khoản đã gửi xác minh');
    const createInfo: Record<string, any> = { ...requestVerifyUserDto };

    const res1 = await this.cloudinaryService.uploadFile(files[0]);
    const identifyCardImageFront = res1.secure_url as string;
    createInfo.identifyCardImageFront = identifyCardImageFront;
    const res2 = await this.cloudinaryService.uploadFile(files[1]);
    const identifyCardImageBack = res2.secure_url as string;
    createInfo.identifyCardImageBack = identifyCardImageBack;

    createInfo.bod = new Date(requestVerifyUserDto.bod);
    await this.repository.userVerify.save({
      ...createInfo,
      isNew: true,
      user: {
        id: currentUser.id,
      },
    });

    await this.userService.updateVerifyStatus(currentUser.id, VerifyStatus.PENDING);
    const newUserVerify = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });

    return {
      ...newUserVerify,
      verifyStatus: VerifyStatus.PENDING,
    };
  }

  async updateVerifyUser(
    currentUser: ITokenPayload,
    updateVerifyUserDto: UpdateVerifyUserDto,
    files: Express.Multer.File[],
    filePresence: string[],
  ) {
    const user = await this.userService.findOneById(currentUser.id);

    if (user.verifyStatus === VerifyStatus.SUCCESS)
      throw new BadRequestException('Tài khoản đã được xác minh');

    const userVerify = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });
    if (!userVerify) throw new NotFoundException('Hồ sơ xác minh không tồn tại');
    const updateInfo: Record<string, any> = { ...updateVerifyUserDto };

    const fileIdentifyCardImageFront = filePresence.includes('front') ? files[0] : null;
    const fileIdentifyCardImageBack = filePresence.includes('back')
      ? filePresence.includes('front')
        ? files[1]
        : files[0]
      : null;
    if (updateVerifyUserDto.bod) {
      updateInfo.bod = new Date(updateVerifyUserDto.bod);
    }
    if (fileIdentifyCardImageFront) {
      const url = userVerify.identifyCardImageFront;

      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }

      const res = await this.cloudinaryService.uploadFile(fileIdentifyCardImageFront);
      updateInfo.identifyCardImageFront = res.secure_url as string;
    }

    if (fileIdentifyCardImageBack) {
      const url = userVerify.identifyCardImageBack;

      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }

      const res = await this.cloudinaryService.uploadFile(fileIdentifyCardImageBack);
      updateInfo.identifyCardImageBack = res.secure_url as string;
    }

    await this.repository.userVerify.save({
      id: userVerify.id,
      ...updateInfo,
      isNew: true,
    });

    const updatedUserVerify = await this.repository.userVerify.findOneBy({ id: userVerify.id });
    return {
      ...updatedUserVerify,
      verifyStatus: user.verifyStatus,
    };
  }

  async adminVerify(userId: string) {
    const user = await this.repository.user.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user.verifyStatus === VerifyStatus.UNVERIFY)
      throw new BadRequestException('Người dùng chưa nộp hồ sơ xác thực');
    if (user.verifyStatus === VerifyStatus.SUCCESS)
      throw new BadRequestException('Người dùng đã được xác thực rồi');
    const userVerify = await this.repository.userVerify.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userVerify) throw new BadRequestException('Người dùng chưa nộp hồ sơ xác thực');
    user.verifyStatus = VerifyStatus.SUCCESS;
    return await this.repository.user.save(user);
  }
}
