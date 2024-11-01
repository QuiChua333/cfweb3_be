import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class InvitateMemberDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsBoolean()
  isEdit: boolean = false;
}
