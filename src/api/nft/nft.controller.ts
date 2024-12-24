import { Body, Controller } from '@nestjs/common';
import { NftService } from './nft.service';
import NftRoute from './nft.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateNFTDto } from './dto';

@Controller(NftRoute.root)
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @InjectRoute(NftRoute.createNFT)
  createNFT(@User() user: ITokenPayload, @Body() createNFTDto: CreateNFTDto) {
    return this.nftService.createNFT(user, createNFTDto);
  }
}
