import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentLikeDto {
  @IsString()
  @IsNotEmpty()
  commentId: string;
}
