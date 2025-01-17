import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CreatePerkDto, DetailPerkDto, ShippingFeeDto, UpdatePerkDto } from './dto';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignService } from '../campaign/campaign.service';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { DetailPerk, ShippingFee } from '@/entities';
import { PaymentStatus } from '@/constants';

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
    const claimeds: number[] = [];
    for (let i = 0; i < perks.length; i++) {
      const claimed = await this.repository.contribution
        .createQueryBuilder('contribution')
        .where('contribution.status = :status', {
          status: PaymentStatus.SUCCESS,
        })
        .andWhere('contribution.perks @> :perkCondition1', {
          perkCondition1: JSON.stringify([{ id: perks[i].id }]),
        })
        .getCount();
      claimeds.push(claimed);
    }
    const response = perks.map((perk, index) => {
      return {
        ...perk,
        claimed: claimeds[index],
      };
    });
    return response;
  }

  async getPerk(perkId: string) {
    const perk = await this.repository.perk.findOne({
      where: {
        id: perkId,
      },
      relations: ['detailPerks.item', 'shippingFees', 'nftCreation'],
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

    const contribution = await this.repository.contribution
      .createQueryBuilder('contribution')
      .where('contribution.isFinish = :isFinish', {
        isFinish: false,
      })
      .where('contribution.status = :status', {
        status: PaymentStatus.SUCCESS,
      })
      .andWhere('contribution.perks @> :perkCondition', {
        perkCondition: JSON.stringify([{ id: perkId }]),
      })
      .getOne();

    if (contribution) throw new BadRequestException('Đặc quyền có người đặt và chưa được giao');
    const url = perk.image;
    if (url) {
      await this.cloudinaryService.destroyFile(url);
    }
    return await this.repository.perk.remove(perk);
  }

  async addPerk(
    currentUser: ITokenPayload,
    createPerkDto: CreatePerkDto,
    file: Express.Multer.File,
  ) {
    const {
      campaignId,
      detailPerks,
      shippingFees,
      estDeliveryDate,
      isFeatured,
      isShipping,
      isVisible,
      ...createData
    } = createPerkDto;
    await this.campaignService.checkOwner(campaignId, currentUser);

    let image: string;

    if (file) {
      const res = await this.cloudinaryService.uploadFile(file);
      image = res.secure_url as string;
    }
    const [month, year] = estDeliveryDate.split('/').map(Number);
    const date = new Date(year, month - 1);
    const perk = await this.repository.perk.save({
      ...createData,
      isFeatured: this.getBoolean(isFeatured),
      isShipping: this.getBoolean(isShipping),
      isVisible: this.getBoolean(isVisible),
      image,
      estDeliveryDate: date,
      campaign: {
        id: campaignId,
      },
    });

    const newDetailPerks: DetailPerk[] = [];
    const detailPerksParse = JSON.parse(detailPerks) as DetailPerkDto[];

    detailPerksParse.forEach((item) => {
      console.log({ item });
      const detailPerk = this.repository.detailPerk.create({
        quantity: item.quantity,
        perk: {
          id: perk.id,
        },
        item: {
          id: item.itemId,
        },
      });
      newDetailPerks.push(detailPerk);
    });

    const newShippingFees: ShippingFee[] = [];
    if (shippingFees) {
      const shippingFeesParse = JSON.parse(shippingFees) as ShippingFeeDto[];
      shippingFeesParse.forEach((item) => {
        const shippingFee = this.repository.shippingFee.create({
          perk: {
            id: perk.id,
          },
          location: item.location,
          fee: item.fee,
        });
        newShippingFees.push(shippingFee);
      });
    }
    await Promise.all([
      this.repository.detailPerk.save(newDetailPerks),
      this.repository.shippingFee.save(newShippingFees),
    ]);

    return perk;
  }

  async editPerk(
    currentUser: ITokenPayload,
    updatePerkDto: UpdatePerkDto,
    file: Express.Multer.File,
    perkId: string,
  ) {
    const {
      detailPerks,
      shippingFees,
      estDeliveryDate,
      isFeatured,
      isShipping,
      isVisible,
      ...updateData
    } = updatePerkDto;
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
      updateData.image = image;
    }

    let date: Date;
    if (estDeliveryDate) {
      const [month, year] = estDeliveryDate.split('/').map(Number);
      const newDate = new Date(year, month - 1);
      date = newDate;
    }

    perk = await this.repository.perk.save({
      ...perk,
      ...updateData,
      ...(isFeatured ? { isFeatured: this.getBoolean(isFeatured) } : {}),
      ...(isShipping ? { isShipping: this.getBoolean(isShipping) } : {}),
      ...(isVisible ? { isVisible: this.getBoolean(isVisible) } : {}),
      ...(estDeliveryDate ? { estDeliveryDate: date } : {}),
    });

    if (detailPerks) {
      await this.repository.perk.save({
        id: perkId,
        detailPerks: [],
      });
      const newDetailPerks: DetailPerk[] = [];
      const detailPerksParse = JSON.parse(detailPerks) as DetailPerkDto[];
      detailPerksParse.forEach((item) => {
        const detailPerk = this.repository.detailPerk.create({
          quantity: item.quantity,
          perk: {
            id: perkId,
          },
          item: {
            id: item.itemId,
          },
        });
        newDetailPerks.push(detailPerk);
      });
      await this.repository.detailPerk.save(newDetailPerks);
    }

    if (shippingFees) {
      await this.repository.perk.save({
        id: perkId,
        shippingFees: [],
      });
      const newShippingFees: ShippingFee[] = [];
      const shippingFeesParse = JSON.parse(shippingFees) as ShippingFeeDto[];
      shippingFeesParse.forEach((item) => {
        const shippingFee = this.repository.shippingFee.create({
          perk: {
            id: perkId,
          },
          location: item.location,
          fee: item.fee,
        });
        newShippingFees.push(shippingFee);
      });
      await this.repository.shippingFee.save(newShippingFees);
    }

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
          item: {
            options: true,
          },
        },
        shippingFees: true,
      },
      order: {
        isFeatured: 'DESC',
      },
    });
    const claimeds: number[] = [];
    for (let i = 0; i < perks.length; i++) {
      const claimed = await this.repository.contribution
        .createQueryBuilder('contribution')
        .where('contribution.status = :status', {
          status: PaymentStatus.SUCCESS,
        })
        .andWhere('contribution.perks @> :perkCondition1', {
          perkCondition1: JSON.stringify([{ id: perks[i].id }]),
        })
        .getCount();
      claimeds.push(claimed);
    }
    const response = perks.map((perk, index) => {
      return {
        ...perk,
        claimed: claimeds[index],
      };
    });
    return response;
  }

  getBoolean(value: string) {
    let res: boolean;
    ['1', 'true'].includes(value) ? (res = true) : (res = false);
    return res;
  }
}
