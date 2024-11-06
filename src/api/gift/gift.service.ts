import { RepositoryService } from '@/repositories/repository.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiftDto, EditGiftDto } from './dto';

@Injectable()
export class GiftService {
  constructor(private readonly repository: RepositoryService) {}

  async addGift(createGiftDto: CreateGiftDto) {
    const { campaignId, userId, ...createData } = createGiftDto;
    const gift = await this.repository.gift.create({
      campaign: {
        id: campaignId,
      },
      user: {
        id: userId,
      },
      ...createData,
    });
    return await this.repository.gift.save(gift);
  }

  async editGift(editGiftDto: EditGiftDto, giftId: string) {
    const gift = await this.repository.gift.findOneBy({ id: giftId });
    if (!gift) throw new NotFoundException('Quà tặng không tồn tại');
    gift.isFinish = editGiftDto.isFinish;
    return await this.repository.gift.save(gift);
  }
}
