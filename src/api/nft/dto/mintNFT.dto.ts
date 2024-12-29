import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MintNFTDto {
  @ValidateNested({
    each: true,
  })
  @IsArray()
  perks: MintPerkDto[];

  @IsString()
  @IsOptional()
  userId?: string;
}

class MintPerkDto {
  @IsString()
  perkId: string;

  @IsNumber()
  quantity: number;
}
