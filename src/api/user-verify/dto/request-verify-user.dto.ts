import { IsNotEmpty, IsString } from 'class-validator';

export class RequestVerifyUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  bod: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  identifyNumber: string;
}
