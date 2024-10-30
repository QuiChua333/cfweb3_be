import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignStatus, Role } from '@/constants';
import { TeamMember } from '@/entities';

@Injectable()
export class CampaignService {
  constructor(private readonly repository: RepositoryService) {}
  async createCampaign(user: ITokenPayload) {
    const newCampagin = this.repository.campaign.create({
      status: CampaignStatus.DRAFT,
      ownerId: user.id,
    });
    return await this.repository.campaign.save(newCampagin);
  }

  async checkOwner(campaignId: string, user: ITokenPayload) {
    // const isAdmin = req.isAdmin;
    // const userId = req.userId;
    // const { idCampaign } = req.params;
    // const campaign = await Campaign.findById(idCampaign).exec();
    // if (campaign) {
    //     const matched = campaign.owner.toString() === userId || campaign.team.some(item => item.user.toString() === userId && item.isAccepted === true) || isAdmin === true;
    //     res.status(200).json({
    //         message: 'Matched',
    //         data: matched
    //     })
    // }
    const campaign = await this.findOneById(campaignId);
    if (!campaign) throw new BadRequestException('Chiến dịch không tồn tại');
    console.log({ campaign });
    const isMatched = campaign.ownerId === user.id || user.role === Role.Admin;
    if (!isMatched) throw new ForbiddenException('Không có quyền truy cập tài nguyên');
    return true;
  }

  findAll() {
    return `This action returns all campaign`;
  }

  findOneById(id: string) {
    return this.repository.campaign.findOneBy({
      id,
    });
  }

  update(id: number, updateCampaignDto: UpdateCampaignDto) {
    return `This action updates a #${id} campaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
