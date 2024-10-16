import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/api/auth/dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findAll() {}

  async findOneById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async create(registerDto: RegisterDto, isVerifiedEmail: boolean = false) {
    const newUser = this.userRepository.create({
      ...registerDto,
      isVerifiedEmail,
    });
    return this.userRepository.save(newUser);
  }

  async updateInfo(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.save({
      id: userId,
      ...updateUserDto,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.userRepository.save({
      id: userId,
      refreshToken,
    });
  }

  async updatePassword(userId: string, password: string) {
    return this.userRepository.save({
      id: userId,
      password,
    });
  }

  async updateVerifiedEmail(userId: string) {
    return this.userRepository.save({
      id: userId,
      isVerifiedEmail: true,
    });
  }
}
