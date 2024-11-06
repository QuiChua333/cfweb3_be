import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordBaseOldPasswordDto {
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  newPassword: string;
}
