import { Global, Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { NftModule } from '@/api/nft/nft.module';

@Global()
@Module({
  providers: [Web3Service],
  exports: [Web3Service],
})
export class Web3Module {}
