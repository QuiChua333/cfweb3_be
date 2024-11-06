import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CreatePerkDto, UpdatePerkDto } from './dto';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignService } from '../campaign/campaign.service';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { DetailPerk } from '@/entities';

@Injectable()
export class PerkService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return `This action returns all perk`;
  }

  async getPerksByCampaign(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const perks = await this.repository.perk.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
    });
    return perks;
  }

  async getPerk(perkId: string) {
    const perk = await this.repository.perk.findOne({
      where: {
        id: perkId,
      },
      relations: ['detailPerks.item', 'shippingFees'],
    });

    if (!perk) throw new NotFoundException('Đặc quyền không tồn tại');
    return perk;
  }

  async deletePerk(currentUser: ITokenPayload, perkId: string) {
    const perk = await this.repository.perk.findOne({
      where: {
        id: perkId,
      },
      relations: ['campaign'],
    });
    if (!perk) throw new NotFoundException('Đặc quyền không tồn tại');
    await this.campaignService.checkOwner(perk.campaign.id, currentUser);
    return await this.repository.perk.remove(perk);
  }

  async addPerk(
    currentUser: ITokenPayload,
    createPerkDto: CreatePerkDto,
    file: Express.Multer.File,
  ) {
    const { campaignId, items, ...createData } = createPerkDto;
    await this.campaignService.checkOwner(campaignId, currentUser);
    const res = await this.cloudinaryService.uploadFile(file);
    const image = res.secure_url as string;
    const perk = await this.repository.perk.save({
      ...createData,
      image,
      campaign: {
        id: campaignId,
      },
    });

    const detailPerks: DetailPerk[] = [];
    items.forEach((item) => {
      const detailPerk = this.repository.detailPerk.create({
        quantity: item.quantity,
        perk: {
          id: perk.id,
        },
        item: {
          id: item.itemId,
        },
      });
      detailPerks.push(detailPerk);
    });
    await this.repository.detailPerk.save(detailPerks);
    return perk;
  }

  async editPerk(
    currentUser: ITokenPayload,
    updatePerkDto: UpdatePerkDto,
    file: Express.Multer.File,
    perkId: string,
  ) {
    let perk = await this.repository.perk.findOne({
      where: {
        id: perkId,
      },
      relations: ['campaign'],
    });
    if (!perk) throw new NotFoundException('Đặc quyền không tồn tại');
    await this.campaignService.checkOwner(perk.campaign.id, currentUser);

    if (file) {
      const url = perk.image;
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      const image = res.secure_url as string;
      updatePerkDto.image = image;
    }
    const { items, ...updateData } = updatePerkDto;
    perk.detailPerks = [];
    await this.repository.perk.save(perk);

    perk = await this.repository.perk.save({
      ...updateData,
    });
    const detailPerks: DetailPerk[] = [];
    items.forEach((item) => {
      const detailPerk = this.repository.detailPerk.create({
        quantity: item.quantity,
        perk: {
          id: perk.id,
        },
        item: {
          id: item.itemId,
        },
      });
      detailPerks.push(detailPerk);
    });
    await this.repository.detailPerk.save(detailPerks);

    return perk;
  }

  async getPerksContainItemsByCampaignId(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const perks = await this.repository.perk.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: {
        detailPerks: {
          item: true,
        },
      },
    });
    return perks;
  }
}
