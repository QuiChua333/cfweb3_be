import { Body, Controller, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { NftService } from './nft.service';
import NftRoute from './nft.routes';
import { InjectRoute, User } from '@/decorators';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateNFTDto, MintNFTDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { NFTPaginationDto } from './dto/nft-pagination.dto';

@Controller(NftRoute.root)
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @InjectRoute(NftRoute.createNFT)
  @UseInterceptors(FileInterceptor('file'))
  createNFT(
    @User() user: ITokenPayload,
    @Body() createNFTDto: CreateNFTDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.nftService.createNFT(user, createNFTDto, file);
  }

  @InjectRoute(NftRoute.getNFTsByCampaign)
  getNFTsByCampaign(@Param('id') campaignId: string) {
    return this.nftService.getNFTsByCampaign(campaignId);
  }
  @InjectRoute(NftRoute.getNFTOfCurrentUser)
  getNFTOfCurrentUser(@User() user: ITokenPayload, @Body() nftPaginationDto: NFTPaginationDto) {
    return this.nftService.getNFTOfCurrentUser(user, nftPaginationDto);
  }

  @InjectRoute(NftRoute.getNFT)
  getNFT(@Param('id') nftId: string) {
    return this.nftService.getNFT(nftId);
  }

  @InjectRoute(NftRoute.mintNFT)
  mintNFT(@Body() mintNFTDto: MintNFTDto) {
    return this.nftService.mintNFT(mintNFTDto);
  }
}
