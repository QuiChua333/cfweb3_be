import { IsNumber, IsString } from 'class-validator';

export class CreateNFTDto {
  @IsString()
  perkId: string;

  @IsString()
  authorAddress: string;

  @IsString()
  name: string;

  @IsString()
  symbol: string;

  @IsString()
  nftPrice: string;
}
