import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ITokenPayload } from '../auth/auth.interface';
import { CreateNFTDto, MintNFTDto } from './dto';
import { RepositoryService } from '@/repositories/repository.service';
import { CampaignService } from '../campaign/campaign.service';
import { Web3Service } from '@/services/web3/web3.service';
import { CryptoCurrency, PaymentStatus } from '@/constants';
import { envs } from '@/config';
import axios from 'axios';
import { Perk } from '@/entities';
import { PinataService } from '@/services/pinata/pinata.service';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { symbol } from 'joi';
import { In } from 'typeorm';
import { ContributionService } from '../contribution/contribution.service';

@Injectable()
export class NftService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
    private readonly contributionService: ContributionService,
    private readonly web3Service: Web3Service,
    private readonly pinataService: PinataService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createNFT(user: ITokenPayload, createNFTDto: CreateNFTDto, file: Express.Multer.File) {
    const { campaignId } = createNFTDto;
    const campaign = await this.repository.campaign.findOne({
      where: {
        id: campaignId,
      },
    });
    if (!campaign) throw new BadRequestException('Chiến dịch không tồn tại');
    await this.campaignService.checkOwner(campaign.id, user);

    let image: string;
    if (file) {
      const res = await this.cloudinaryService.uploadFile(file);
      image = res.secure_url as string;
    }

    const metadataLink = await this.handleMetadata(createNFTDto, file);
    return await this.repository.nftCreation.save({
      campaign: {
        id: campaign.id,
      },
      name: createNFTDto.name,
      symbol: createNFTDto.symbol,
      color: createNFTDto.color,
      price: createNFTDto.price,
      ethPrice: createNFTDto.ethPrice,
      factoryContractAddress: envs.web3.factoryContractAddress,
      materials: createNFTDto.materials,
      styles: createNFTDto.styles,
      supply: createNFTDto.supply,
      description: createNFTDto.description,
      image,
      uri: metadataLink,
    });
  }

  private async handleMetadata(createNFTDto: CreateNFTDto, fileExpress: Express.Multer.File) {
    // const response = await axios.get(perk.image, { responseType: 'arraybuffer' });
    // // Lấy MIME type từ header response
    // const mimeType = response.headers['content-type'];
    // if (!mimeType.startsWith('image/')) {
    //   throw new Error('URL không phải là ảnh hợp lệ');
    // }

    // // Tách đuôi file từ MIME type
    // const extension = mimeType.split('/')[1];

    // // Tạo Blob từ dữ liệu buffer
    // const blob = new Blob([response.data], { type: 'image/jpeg' });

    // // // Tạo File từ Blob

    // const fileName = `${createNFTDto.symbol}_${perk.id.slice(-5)}`;
    const file = new File([fileExpress.buffer], fileExpress.originalname, { type: 'image/jpeg' });

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
    const attributes = this.createArrayAttributes(createNFTDto);
    console.log(attributes);
    const metadataNFT = {
      pinataMetadata: {
        name: `${createNFTDto.symbol}.json`,
        keyvalues: {
          symbol: `${createNFTDto.symbol}`,
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
      pinataContent: {
        description: createNFTDto.description,
        external_url: '',
        image: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
        name: createNFTDto.name,
        symbol: createNFTDto.symbol,
        attributes: attributes,
        price: createNFTDto.ethPrice,
        currency: 'ETH',
      },
    };

    const metadataRes = await this.pinataService.uploadJSON(metadataNFT, {
      maxContentLength: -1,
    });

    return `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
  }

  private createArrayAttributes(createNFTDto: CreateNFTDto) {
    console.log(createNFTDto);
    const styles = createNFTDto.styles.split('|');
    const materials = createNFTDto.materials.split('|');
    const color = createNFTDto.color;
    const ethPrice = createNFTDto.ethPrice;
    const attributes = [];
    styles.map((style) =>
      attributes.push({
        trait_type: 'Style',
        value: style,
      }),
    );
    materials.map((m) =>
      attributes.push({
        trait_type: 'Material',
        value: m,
      }),
    );
    attributes.push({
      trait_type: 'Color',
      value: color,
    });
    attributes.push({
      trait_type: 'Price',
      value: `${ethPrice} ETH`,
    });
    return attributes;
  }

  async mintNFT(mintNFTDto: MintNFTDto) {
    const { userId, nfts: nftCreations, contribution } = mintNFTDto;
    const nftCreationIds = nftCreations.map((item) => item.nftCreationId);
    const nftCreationsData = await this.repository.nftCreation.find({
      where: {
        id: In(nftCreationIds),
      },
    });

    if (nftCreationsData.length !== nftCreationIds.length)
      throw new BadRequestException('Có phần tử không phải là NFT');

    const nfts: {
      nftCreationId: string;
      tokenIds: number[];
      contractAddress: string;
      uri: string;
    }[] = [];
    for (let i = 0; i < nftCreationIds.length; i++) {
      const nftCreation = await this.repository.nftCreation.findOne({
        where: {
          id: nftCreationIds[i],
        },
      });
      const tokenIds: number[] = [];
      for (let j = 0; j < nftCreations[i].quantity; j++) {
        const newNFT = await this.repository.nft.save({
          nftCreation: {
            id: nftCreation.id,
          },
          isMinted: false,
          tokenId: new Date().getTime(),
          uri: nftCreation.uri,
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
        nftCreationId: nftCreationIds[i],
        uri: nftCreation.uri,
        tokenIds: tokenIds,
        contractAddress: nftCreation.contractAddress,
      });
    }
    const contributionId = await this.contributionService.paymentCrypto({
      ...contribution,
      nfts: contribution.nfts.map((item) => {
        const nft = nfts.find((item2) => item2.nftCreationId === item.id);
        return {
          ...item,
          contractAddress: nft.contractAddress,
          tokenIds: nft.tokenIds,
          uri: nft.uri,
        };
      }),
    });
    return {
      nfts,
      contributionId,
    };
  }

  async getNFTsByCampaign(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');

    const nfts = await this.repository.nftCreation.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
    const allContributions = await this.repository.contribution.find({
      where: {
        status: PaymentStatus.SUCCESS,
      },
    });

    const claimed = {};
    for (let i = 0; i < allContributions.length; i++) {
      const nfts = allContributions[i].nfts as string;

      if (nfts) {
        const nftsObject = JSON.parse(nfts);

        for (let j = 0; j < nftsObject.length; j++) {
          const nft = nftsObject[j];
          if (!claimed[nft.id]) {
            claimed[nft.id] = 0;
          }
          claimed[nft.id] += nft.quantity;
        }
      }
    }
    const response = nfts.map((nft, index) => {
      return {
        ...nft,
        claimed: claimed[nft.id] ?? 0,
      };
    });
    return response;
  }

  async getNFT(nftId: string) {
    const nft = await this.repository.nftCreation.findOne({
      where: {
        id: nftId,
      },
    });

    if (!nft) throw new NotFoundException('NFT không tồn tại');
    return nft;
  }
}
