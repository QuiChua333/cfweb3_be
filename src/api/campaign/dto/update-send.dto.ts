import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSendDto {
  @IsString()
  @IsOptional()
  isSend?: string;
}
