import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserVerifyService } from './user-verify.service';
import { CreateUserVerifyDto } from './dto/create-user-verify.dto';
import { UpdateUserVerifyDto } from './dto/update-user-verify.dto';
import UserVerifyRoute from './user-verify.routes';
import { InjectRoute } from '@/decorators';

@Controller('user-verify')
export class UserVerifyController {
  constructor(private readonly userVerifyService: UserVerifyService) {}

  @Post()
  create(@Body() createUserVerifyDto: CreateUserVerifyDto) {
    return this.userVerifyService.create(createUserVerifyDto);
  }

  @InjectRoute(UserVerifyRoute.findAll)
  findAll() {
    return this.userVerifyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userVerifyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserVerifyDto: UpdateUserVerifyDto) {
    return this.userVerifyService.update(+id, updateUserVerifyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userVerifyService.remove(+id);
  }
}
