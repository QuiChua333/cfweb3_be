import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignService } from '../campaign/campaign.service';
import { Item, Option } from '@/entities';
import { UpdateItemDto } from './dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly campaignService: CampaignService,
  ) {}

  findAll() {
    return `This action returns all item`;
  }

  async getItemsByCampaign(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const items = await this.repository.item.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: {
        options: true,
      },
    });

    const response = items.map((item) => {
      return {
        ...item,
        options: item.options.map((option) => {
          return {
            ...option,
            values: option.values.split('|'),
          };
        }),
      };
    });

    return response;
  }

  async addItem(currentUser: ITokenPayload, createItemDto: CreateItemDto) {
    const campaign = await this.campaignService.checkOwner(createItemDto.campaignId, currentUser);
    const options: Option[] = [];
    if (createItemDto.isHasOption) {
      createItemDto.options.forEach((item) => {
        const option = this.repository.option.create({
          name: item.name,
          values: item.values.join('|'),
        });
        options.push(option);
      });
    }
    const item = this.repository.item.create({
      name: createItemDto.name,
      isHasOption: createItemDto.isHasOption,
      campaign: {
        id: createItemDto.campaignId,
      },
      options: options,
    });

    return await this.repository.item.save(item);
  }

  async editItem(currentUser: ITokenPayload, updateItemDto: UpdateItemDto, itemId: string) {
    const campaign = await this.campaignService.checkOwner(updateItemDto.campaignId, currentUser);
    const item = await this.repository.item.findOneBy({ id: itemId });
    if (!item) throw new NotFoundException('Item không tồn tại');
    item.options = [];
    await this.repository.item.save(item);
    const options: Option[] = [];
    if (updateItemDto.isHasOption && updateItemDto.options?.length > 0) {
      updateItemDto.options.forEach((item) => {
        const option = this.repository.option.create({
          item: {
            id: itemId,
          },
          name: item.name,
          values: item.values.join('|'),
        });
        options.push(option);
      });
    }

    return await this.repository.item.save({
      id: itemId,
      isHasOption: updateItemDto.isHasOption,
      options: options,
      name: updateItemDto.name,
    });
  }

  async deleteItem(itemId: string) {
    const item = await this.repository.item.findOneBy({ id: itemId });
    if (!item) throw new NotFoundException('Item không tồn tại');
    return await this.repository.item.remove(item);
  }

  async getItemsContainPerksByCampaignId(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');

    const items = await this.repository.item.find({
      where: {
        campaign: {
          id: campaignId,
        },
      },
      relations: {
        detailPerks: {
          perk: true,
        },
        options: true,
      },
    });
    const response = items.map((item) => {
      return {
        ...item,
        detailPerks: item.detailPerks.map((detailPerk) => {
          return {
            perk: {
              name: detailPerk.perk.name,
            },
          };
        }),
      };
    });
    return response;
  }

  async getItemContainPerks(itemId: string) {
    const item = await this.repository.item.findOne({
      where: {
        id: itemId,
      },
      relations: {
        detailPerks: {
          perk: true,
        },
        options: true,
      },
    });
    const response = {
      ...item,
      detailPerks: item.detailPerks.map((detailPerk) => {
        return {
          perk: {
            name: detailPerk.perk.name,
          },
        };
      }),
    };
    return response;
  }
}
