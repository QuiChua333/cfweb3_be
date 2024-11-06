import { IsBoolean } from 'class-validator';

export class EditGiftDto {
  @IsBoolean()
  isFinish: boolean;
}
