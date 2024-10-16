import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
