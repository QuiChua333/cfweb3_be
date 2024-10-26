import { Injectable } from '@nestjs/common';
import { CreateFollowCampaignDto } from './dto/create-follow-campaign.dto';
import { UpdateFollowCampaignDto } from './dto/update-follow-campaign.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class FollowCampaignService {
  constructor(private readonly repository: RepositoryService) {}
  create(createFollowCampaignDto: CreateFollowCampaignDto) {
    return 'This action adds a new followCampaign';
  }

  findAll() {
    return `This action returns all followCampaign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} followCampaign`;
  }

  update(id: number, updateFollowCampaignDto: UpdateFollowCampaignDto) {
    return `This action updates a #${id} followCampaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} followCampaign`;
  }
}
