import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/api/auth/dto';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { UpdateProfileUserDto } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';
import { VerifyStatus } from '@/constants';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {}

  async findOneById(id: string) {
    const user = this.repository.user.findOneBy({ id });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async findOneByEmail(email: string) {
    const user = this.repository.user.findOneBy({ email });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async create(registerDto: RegisterDto, isVerifiedEmail: boolean = false) {
    const newUser = this.repository.user.create({
      ...registerDto,
      isVerifiedEmail,
    });
    return this.repository.user.save(newUser);
  }

  async updateProfile(
    user: ITokenPayload,
    updateUserDto: UpdateProfileUserDto,
    file: Express.Multer.File,
  ) {
    const currentUser = await this.findOneById(user.id);
    if (file) {
      const url = currentUser.avatar;
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      const avatar = res.secure_url as string;
      updateUserDto['avatar'] = avatar;
    }

    return await this.repository.user.save({
      id: user.id,
      ...updateUserDto,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.repository.user.save({
      id: userId,
      refreshToken,
    });
  }

  async updatePassword(userId: string, password: string) {
    return this.repository.user.save({
      id: userId,
      password,
    });
  }

  async updateVerifyStatus(userId: string, status: VerifyStatus) {
    await this.repository.user.save({
      id: userId,
      verifyStatus: status,
    });
  }

  async updateVerifiedEmail(userId: string) {
    return this.repository.user.save({
      id: userId,
      isVerifiedEmail: true,
    });
  }
}
