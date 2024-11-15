import { RepositoryService } from '@/repositories/repository.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiftDto, EditGiftDto, GiftFinishQueryStatus, GiftPaginationDto } from './dto';
import { EmailService } from '@/services/email/email.service';

@Injectable()
export class GiftService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly emailService: EmailService,
  ) {}

  async getAllGiftsByCampaign(giftPaginationDto: GiftPaginationDto) {
    const { page = 1, limit = 10, searchString, status, campaignId } = giftPaginationDto;
    const query = this.repository.gift
      .createQueryBuilder('gift')
      .leftJoinAndSelect('gift.campaign', 'campaign')
      .leftJoinAndSelect('gift.user', 'user')
      .where('campaign.id = :campaignId', { campaignId });

    if (searchString && searchString.trim() !== '') {
      query.andWhere('(gift.email ILIKE :searchString)', {
        searchString: `%${searchString}%`,
      });
    }

    // Filter by status if provided
    if (status && status !== GiftFinishQueryStatus.ALL) {
      query.andWhere('gift.isFinish = :status', {
        status: status === GiftFinishQueryStatus.FINISH,
      });
    }

    query.skip((page - 1) * limit).take(limit);

    const [gifts, total] = await query.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      gifts: gifts.map((gift) => ({
        id: gift.id,
        email: gift.email,
        fullName: gift.user?.fullName || null,
        isFinish: gift.isFinish,
        amount: gift.amount,
        perks: JSON.parse(gift.perks as string),
        shippingInfo: JSON.parse(gift.shippingInfo as string),
        estDeliveryDate: JSON.parse(gift.shippingInfo as string).estDeliveryDate,
      })),
      totalPages,
      page,
      limit,
    };
  }
  async addGift(createGiftDto: CreateGiftDto) {
    const { campaignId, userId, shippingInfo, perks, money, ...createData } = createGiftDto;
    const gift = this.repository.gift.create({
      campaign: {
        id: campaignId,
      },
      user: {
        id: userId,
      },
      amount: money,
      ...createData,
      shippingInfo: JSON.stringify(shippingInfo),
      perks: JSON.stringify(perks),
    });

    const saveGift = await this.repository.gift.save(gift);

    this.sendMailGiftSuccess(saveGift.id);
    return saveGift;
  }

  async editGift(editGiftDto: EditGiftDto, giftId: string) {
    const gift = await this.repository.gift.findOneBy({ id: giftId });
    if (!gift) throw new NotFoundException('Quà tặng không tồn tại');
    gift.isFinish = editGiftDto.isFinish;
    return await this.repository.gift.save(gift);
  }

  private async sendMailGiftSuccess(giftId: string) {
    const gift = await this.repository.gift.findOne({
      where: {
        id: giftId,
      },
      relations: {
        campaign: true,
      },
      select: {
        campaign: {
          title: true,
        },
      },
    });
    await this.emailService.sendGiftSuccessHasPerk(gift);
  }
}
