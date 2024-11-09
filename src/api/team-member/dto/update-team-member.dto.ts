import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MemberDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  isEdit: boolean;

  @IsString()
  @IsOptional()
  role?: string;
}
export class UpdateTeamMemberDto {
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  members?: MemberDto[];
}
