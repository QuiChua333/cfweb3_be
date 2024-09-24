import { RegisterUserDto } from '@/api/auth/dto';
import { UserService } from '@/api/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerUserDto: RegisterUserDto) {
    return 'This is register';
  }
}
