import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { symbol } from 'joi';

@Injectable()
export class NftService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
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
        attributes: this.createArrayAttributes(createNFTDto),
        price: createNFTDto.ethPrice,
        currency: 'ETH',
      },
    };

    const metadataRes = await this.pinataService.uploadJSON(metadataNFT, {
      maxContentLength: -1,
    });

    return `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
  }

  private async createArrayAttributes(createNFTDto: CreateNFTDto) {
    const styles = createNFTDto.styles.split('|');
    const materials = createNFTDto.styles.split('|');
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
    return 1;
    // const { userId, perks } = mintNFTDto;
    // const perkIds = perks.map((item) => item.perkId);
    // const nonNFTPerk = await this.repository.perk.findOne({
    //   where: {
    //     id: In(perkIds),
    //     isNFT: false,
    //   },
    // });

    // if (nonNFTPerk) {
    //   throw new BadRequestException('Có đặc quyền không phải là NFT');
    // }
    // const nfts: { perkId: string; tokenIds: number[]; nftContractAddress: string; uri: string }[] =
    //   [];
    // for (let i = 0; i < perkIds.length; i++) {
    //   const perk = await this.repository.perk.findOne({
    //     where: {
    //       id: perkIds[i],
    //     },
    //     relations: {
    //       nftCreation: true,
    //     },
    //   });

    //   const tokenIds: number[] = [];
    //   for (let j = 0; j < perks[i].quantity; j++) {
    //     const newNFT = await this.repository.nft.save({
    //       nftCreation: {
    //         id: perk.nftCreation.id,
    //       },
    //       isMinted: false,
    //       tokenId: new Date().getTime(),
    //       uri: perk.nftCreation.metadataLink,
    //       ...(userId
    //         ? {
    //             user: {
    //               id: userId,
    //             },
    //           }
    //         : {}),
    //     });
    //     tokenIds.push(newNFT.tokenId);
    //   }

    //   nfts.push({
    //     perkId: perkIds[i],
    //     uri: perk.nftCreation.metadataLink,
    //     tokenIds: tokenIds,
    //     nftContractAddress: perk.nftCreation.nftContractAddress,
    //   });
    // }

    // return nfts;
  }

  async getNFTsByCampaign(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');

    const nfts = await this.repository.nftCreation.find({
      where: {
        campaign: {
          id: campaignId,
        },
        createdSuccess: true,
      },
    });
    // const claimeds: number[] = [];
    // for (let i = 0; i < perks.length; i++) {
    //   const claimed = await this.repository.contribution
    //     .createQueryBuilder('contribution')
    //     .where('contribution.status = :status', {
    //       status: PaymentStatus.SUCCESS,
    //     })
    //     .andWhere('contribution.perks @> :perkCondition1', {
    //       perkCondition1: JSON.stringify([{ id: perks[i].id }]),
    //     })
    //     .getCount();
    //   claimeds.push(claimed);
    // }
    // const response = perks.map((perk, index) => {
    //   return {
    //     ...perk,
    //     claimed: claimeds[index],
    //   };
    // });
    return nfts;
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
