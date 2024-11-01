import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { CampaignImageTypeName, UpdateCampaignDto } from './dto/update-campaign.dto';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignStatus, Role } from '@/constants';
import { TeamMember } from '@/entities';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';

@Injectable()
export class CampaignService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return `This action returns all campaign`;
  }
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
    const campaign = await this.repository.campaign.findOne({
      where: {
        id: campaignId,
      },
      relations: ['teamMembers'],
    });
    if (!campaign) throw new BadRequestException('Chiến dịch không tồn tại');
    const isMatched = campaign.ownerId === user.id || user.role === Role.Admin;
    if (!isMatched) throw new ForbiddenException('Không có quyền truy cập tài nguyên');
    return true;
  }

  async editCampaign(
    campaignId: string,
    user: ITokenPayload,
    data: UpdateCampaignDto,
    file: Express.Multer.File,
  ) {
    // checkonwer
    await this.checkOwner(campaignId, user);
    const campaign = await this.findOneById(campaignId);
    const { imageTypeName, ...dataUpdate } = data;
    if (file) {
      if (!imageTypeName) throw new BadRequestException('Vui lòng bổ sung loại hình ảnh');
      const url = campaign[imageTypeName];
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      dataUpdate[imageTypeName] = res.secure_url as string;
    }
    return await this.repository.campaign.save({
      id: campaignId,
      ...dataUpdate,
    });
  }

  async launchCampaign(campaignId: string, user: ITokenPayload) {
    // check owner
    await this.checkOwner(campaignId, user);
    return await this.repository.campaign.update(campaignId, {
      publishedAt: new Date(),
      status: CampaignStatus.PENDING,
    });
  }

  findOneById(id: string) {
    return this.repository.campaign.findOneBy({
      id,
    });
  }
}
