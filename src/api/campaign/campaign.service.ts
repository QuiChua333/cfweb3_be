import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { CampaignStatus, ConfirmMemberStatus, Role } from '@/constants';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { FaqDto, UpdateCampaignDto } from './dto';
import { FAQ } from '@/entities';
import { envs } from '@/config';

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
      relations: ['teamMembers.user', 'owner'],
    });

    if (!campaign) throw new BadRequestException('Chiến dịch không tồn tại');
    const isMatched =
      campaign.ownerId === user.id ||
      user.role === Role.Admin ||
      campaign.teamMembers.some(
        (member) =>
          member.confirmStatus === ConfirmMemberStatus.ACCEPTED && member.user.id === user.id,
      );
    if (!isMatched) throw new ForbiddenException('Không có quyền truy cập tài nguyên');
    return campaign;
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
    const { imageTypeName, faqs, fieldId, ...dataUpdate } = data;

    if (file) {
      if (!imageTypeName) throw new BadRequestException('Vui lòng bổ sung loại hình ảnh');
      const url = campaign[imageTypeName];
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      dataUpdate[imageTypeName] = res.secure_url as string;
    }
    if (faqs) {
      await this.repository.faq.delete({
        campaign: {
          id: campaign.id,
        },
      });
      const newFaqs: FAQ[] = [];
      const faqsParse = JSON.parse(faqs) as FaqDto[];
      faqsParse.forEach((item) => {
        const faq = this.repository.faq.create({
          campaign: {
            id: campaign.id,
          },
          question: item.question,
          answer: item.answer,
        });
        newFaqs.push(faq);
      });
      await this.repository.faq.save(newFaqs);
    }

    return await this.repository.campaign.save({
      id: campaignId,
      ...dataUpdate,
      ...(fieldId
        ? {
            field: {
              id: fieldId,
            },
          }
        : {}),
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

  async deleteCampaign(campaignId: string, user: ITokenPayload) {
    await this.checkOwner(campaignId, user);
    return await this.repository.campaign.softDelete(campaignId);
  }

  async getCampaignsOfOwner(userId: string) {
    const campaigns = await this.repository.campaign.find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        owner: true,
        teamMembers: {
          user: true,
        },
      },
      select: {
        teamMembers: {
          user: {
            id: true,
          },
        },
      },
    });

    return campaigns;
  }

  async getQuantityCampaignsOfOwner(campaignId: string) {
    const campaign = await this.findOneById(campaignId);
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    const ownerId = campaign.ownerId;
    const [_campaigns, count] = await this.repository.campaign.findAndCount({
      where: {
        owner: {
          id: ownerId,
        },
      },
    });

    return count;
  }

  async getPopulateCampaigns() {
    const campaigns = await this.repository.campaign.find({
      take: 20,
    });
    return campaigns;
  }

  findOneById(id: string) {
    return this.repository.campaign.findOneBy({
      id,
    });
  }

  async findOneDetail(id: string) {
    return this.repository.campaign.findOne({
      where: {
        id: id,
      },
      relations: {
        field: true,
        faqs: true,
        teamMembers: true,
        owner: true,
      },
      select: {
        owner: {
          verifyStatus: true,
        },
      },
    });
  }

  async CKEUpload(file: Express.Multer.File) {
    const res = await this.cloudinaryService.uploadFile(file, envs.cloudinary.cke_folder_name);
    return res.secure_url as string;
  }
}
