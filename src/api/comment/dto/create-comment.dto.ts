import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  replyId?: string;

  @IsString()
  @IsNotEmpty()
  campaignId: string;
}
