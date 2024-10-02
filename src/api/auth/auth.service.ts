import { RegisterDto } from '@/api/auth/dto';
import { UserService } from '@/api/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDto: RegisterDto) {
    return 'This is register';
  }
}
