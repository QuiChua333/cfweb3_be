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

  async create(registerDto: RegisterDto) {
    const newUser = this.userRepository.create(registerDto);
    return this.userRepository.save(newUser);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.save({
      id: userId,
      ...updateUserDto,
    });
  }
}
