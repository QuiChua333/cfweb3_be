import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/api/auth/dto';
import { UpdateUserDto } from './dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class UserService {
  constructor(private readonly repository: RepositoryService) {}

  async findAll() {}

  async findOneById(id: string) {
    return this.repository.user.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return this.repository.user.findOneBy({ email });
  }

  async create(registerDto: RegisterDto, isVerifiedEmail: boolean = false) {
    const newUser = this.repository.user.create({
      ...registerDto,
      isVerifiedEmail,
    });
    return this.repository.user.save(newUser);
  }

  async updateInfo(userId: string, updateUserDto: UpdateUserDto) {
    return this.repository.user.save({
      id: userId,
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

  async updateVerifiedEmail(userId: string) {
    return this.repository.user.save({
      id: userId,
      isVerifiedEmail: true,
    });
  }
}
