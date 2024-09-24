import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthRoute from '@/api/auth/auth.routes';
import { InjectRoute } from '@/decorators';
import { RegisterUserDto } from '@/api/auth/dto';

@Controller(AuthRoute.root)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @InjectRoute(AuthRoute.register)
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
