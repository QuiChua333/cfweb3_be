import { BadRequestException, Injectable } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateNFTDto, MintNFTDto } from './dto';
import { RepositoryService } from '@/repositories/repository.service';
import { CampaignService } from '../campaign/campaign.service';
import { Web3Service } from '@/services/web3/web3.service';
import { CryptoCurrency } from '@/constants';
import { envs } from '@/config';
import axios from 'axios';
import { Perk } from '@/entities';
import { PinataService } from '@/services/pinata/pinata.service';
import { In } from 'typeorm';

@Injectable()
export class NftService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
    // private readonly web3Service: Web3Service,
    private readonly pinataService: PinataService,
  ) {}
  async createNFT(user: ITokenPayload, createNFTDto: CreateNFTDto) {
    const { perkId } = createNFTDto;
    const perk = await this.repository.perk.findOne({
      where: {
        id: perkId,
      },
      relations: {
        campaign: true,
        detailPerks: {
          item: {
            options: true,
          },
        },
      },
    });
    if (!perk) throw new BadRequestException('Đặc quyền không tồn tại');
    await this.campaignService.checkOwner(perk.campaign.id, user);

    const metadataLink = await this.handleMetadata(perk, createNFTDto);

    await this.repository.perk.save({
      id: perkId,
      isNFT: true,
    });

    // const tx = await this.web3Service.createNFT(createNFTDto, metadataLink);

    // await this.repository.nftCreation.save({
    //   authorAddress: createNFTDto.authorAddress,
    //   factoryContractAddress: envs.web3.factoryContractAddress,
    //   name: createNFTDto.name,
    //   symbol: createNFTDto.symbol,
    //   transactionHash: tx.hash,
    //   price: createNFTDto.nftPrice,
    //   metadataLink,
    //   perk: {
    //     id: perk.id,
    //   },
    // });

    // console.log('metadataNFTLink: ', metadataLink);
    // console.log('Creating NFT transaction:', tx.hash);
    // return tx.hash;
  }

  private async handleMetadata(perk: Perk, createNFTDto: CreateNFTDto) {
    const response = await axios.get(perk.image, { responseType: 'arraybuffer' });
    // Lấy MIME type từ header response
    const mimeType = response.headers['content-type'];
    if (!mimeType.startsWith('image/')) {
      throw new Error('URL không phải là ảnh hợp lệ');
    }

    // Tách đuôi file từ MIME type
    const extension = mimeType.split('/')[1];

    // Tạo Blob từ dữ liệu buffer
    const blob = new Blob([response.data], { type: 'image/jpeg' });

    // // Tạo File từ Blob

    const fileName = `${createNFTDto.symbol}_${perk.id.slice(-5)}`;
    const file = new File([blob], `${fileName}.${extension}`, { type: 'image/jpeg' });

    let formData = new FormData();

    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      keyvalues: {
        symbol: `${createNFTDto.symbol}`,
      },
    });

    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 1,
    });

    formData.append('pinataOptions', pinataOptions);

    const imageRes = await this.pinataService.uploadFile(formData, {
      maxContentLength: -1,
    });

    const imageIpfsHash = imageRes.data.IpfsHash;

    const metadataNFT = {
      pinataMetadata: {
        name: `${fileName}.json`,
        keyvalues: {
          symbol: `${createNFTDto.symbol}`,
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
      pinataContent: {
        description: perk.description,
        external_url: '',
        image: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
        name: createNFTDto.name,

        currency: CryptoCurrency.ETH,
        attributes: perk.detailPerks?.map((detailPerk) => {
          const item = detailPerk.item;
          const options = item.isHasOption
            ? item.options.map((option) => ({
                trait_type: option.name,
                value: option.values.split('|'),
              }))
            : [];

          return {
            trait_type: 'Item Name',
            value: item.name,
            quantity: detailPerk.quantity,
            options,
          };
        }),
        price: {
          currency: 'ETH',
          value: perk.ethPrice,
        },
        campaign: {
          id: perk.campaign.id,
          title: perk.campaign.title,
        },
      },
    };

    const metadataRes = await this.pinataService.uploadJSON(metadataNFT, {
      maxContentLength: -1,
    });

    return `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
  }

  async mintNFT(mintNFTDto: MintNFTDto) {
    const { userId, perks } = mintNFTDto;
    const perkIds = perks.map((item) => item.perkId);
    const nonNFTPerk = await this.repository.perk.findOne({
      where: {
        id: In(perkIds),
        isNFT: false,
      },
    });

    if (nonNFTPerk) {
      throw new BadRequestException('Có đặc quyền không phải là NFT');
    }
    const nfts: { perkId: string; tokenIds: number[]; nftContractAddress: string; uri: string }[] =
      [];
    for (let i = 0; i < perkIds.length; i++) {
      const perk = await this.repository.perk.findOne({
        where: {
          id: perkIds[i],
        },
        relations: {
          nftCreation: true,
        },
      });

      const tokenIds: number[] = [];
      for (let j = 0; j < perks[i].quantity; j++) {
        const newNFT = await this.repository.nft.save({
          nftCreation: {
            id: perk.nftCreation.id,
          },
          isMinted: false,
          tokenId: new Date().getTime(),
          uri: perk.nftCreation.metadataLink,
          ...(userId
            ? {
                user: {
                  id: userId,
                },
              }
            : {}),
        });
        tokenIds.push(newNFT.tokenId);
      }

      nfts.push({
        perkId: perkIds[i],
        uri: perk.nftCreation.metadataLink,
        tokenIds: tokenIds,
        nftContractAddress: perk.nftCreation.nftContractAddress,
      });
    }

    return nfts;
  }
}
