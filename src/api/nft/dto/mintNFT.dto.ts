import { PaymentDto } from '@/api/contribution/dto';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MintNFTDto {
  @ValidateNested({
    each: true,
  })
  @IsArray()
  nfts: MintNFTCreationDto[];

  @IsString()
  @IsOptional()
  userId?: string;

  @ValidateNested()
  @Type(() => PaymentDto)
  contribution: PaymentDto;
}

class MintNFTCreationDto {
  @IsString()
  nftCreationId: string;

  @IsNumber()
  quantity: number;
}
