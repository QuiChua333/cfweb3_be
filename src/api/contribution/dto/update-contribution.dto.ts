import { IsBoolean } from 'class-validator';

export class UpdateContributionDto {
  @IsBoolean()
  isFinish: boolean;
}
