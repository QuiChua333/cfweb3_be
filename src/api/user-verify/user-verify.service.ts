import { Injectable } from '@nestjs/common';
import { CreateUserVerifyDto } from './dto/create-user-verify.dto';
import { UpdateUserVerifyDto } from './dto/update-user-verify.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class UserVerifyService {
  constructor(
    private readonly repository: RepositoryService
  ) {}
  create(createUserVerifyDto: CreateUserVerifyDto) {
    return 'This action adds a new userVerify';
  }

  findAll() {
    return `This action returns all userVerify`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userVerify`;
  }

  update(id: number, updateUserVerifyDto: UpdateUserVerifyDto) {
    return `This action updates a #${id} userVerify`;
  }

  remove(id: number) {
    return `This action removes a #${id} userVerify`;
  }
}
