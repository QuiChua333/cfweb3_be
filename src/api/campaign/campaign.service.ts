import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import {
  CAMPAIGN_INDEX_NAME,
  CampaignStatus,
  ConfirmMemberStatus,
  PaymentStatus,
  Role,
  UserStatus,
} from '@/constants';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import {
  CampaignExplorePaginationDto,
  CampaignExploreQueryStatus,
  CampaignPaginationDto,
  CampaignQueryStatus,
  FaqDto,
  UpdateCampaignDto,
} from './dto';
import { Campaign, FAQ } from '@/entities';
import { envs } from '@/config';
import { EmailService } from '@/services/email/email.service';
import { SearchService } from '@/services/search/search.service';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { IUpdateCampaignES } from '@/services/search/search.interface';

@Injectable()
export class CampaignService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
    private readonly searchService: SearchService,
  ) {}

  async findAll(campaignPaginationDto: CampaignPaginationDto) {
    const { page = 1, limit = 10, searchString, status } = campaignPaginationDto;
    const query = this.repository.campaign
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.owner', 'owner')
      .where('campaign.deletedAt IS NULL'); // Lọc các campaign chưa bị xóa

    // Tìm kiếm không phân biệt hoa thường theo searchString trong title
    if (searchString && searchString.trim() !== '') {
      query.andWhere('campaign.title ILIKE :searchString OR owner.fullName ILIKE :searchString', {
        searchString: `%${searchString}%`, // Thêm dấu % để tìm kiếm chuỗi con
      });
    }

    // Tìm kiếm theo status
    if (status && status !== CampaignQueryStatus.ALL) {
      query.andWhere('campaign.status = :status', { status });
    }

    // Phân trang
    const [results, total] = await query
      .take(limit) // Giới hạn số bản ghi trên mỗi trang
      .skip((page - 1) * limit) // Bắt đầu từ vị trí dựa trên trang
      .getManyAndCount(); // Lấy dữ liệu và tổng số bản ghi
    const totalPages = Math.ceil(total / limit);
    return {
      campaigns: results,
      totalPages,
      page,
      limit,
    };
  }

  async getCampaignsExplore(campaignExplorePaginationDto: CampaignExplorePaginationDto) {
    const {
      page = 1,
      limit = 10,
      searchString,
      status,
      field,
      criteria,
      fieldGroup,
    } = campaignExplorePaginationDto;

    const query = this.repository.campaign
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.owner', 'owner')
      .leftJoinAndSelect('campaign.field', 'field')
      .leftJoinAndSelect('field.fieldGroup', 'fieldGroup') // Liên kết với FieldGroup
      .leftJoin('campaign.contributions', 'contribution') // Thêm join với bảng contributions
      .addSelect('COALESCE(SUM(contribution.amount), 0)', 'totalAmount') // Tính tổng số tiền đóng góp cho chiến dịch
      .where('campaign.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: [CampaignStatus.DRAFT],
      })
      .select([
        'campaign.id',
        'campaign.title',
        'campaign.cardImage',
        'campaign.tagline',
        'campaign.status',
        'campaign.publishedAt',
        'campaign.goal',
        'campaign.duration',
        'owner.id',
        'owner.fullName',
        'field.name',
        'fieldGroup.name',
      ]);

    // Tìm kiếm theo từ khóa trong tiêu đề hoặc khẩu hiệu
    if (searchString && searchString.trim() !== '') {
      query.andWhere(
        '(campaign.title ILIKE :searchString OR campaign.tagline ILIKE :searchString)',
        {
          searchString: `%${searchString}%`,
        },
      );
    }

    // Lọc theo trạng thái của chiến dịch
    if (status && status !== CampaignExploreQueryStatus.ALL) {
      query.andWhere('campaign.status = :status', { status });
    }

    // Lọc theo tên lĩnh vực
    if (field && field !== 'Tất cả') {
      query.andWhere('field.name = :field', { field });
    } else if (fieldGroup && fieldGroup !== 'Tất cả') {
      query.andWhere('fieldGroup.name = :fieldGroup', { fieldGroup });
    }

    // Sắp xếp theo tiêu chí
    if (criteria === 'new') {
      query.orderBy('campaign.publishedAt', 'DESC');
    }
    query
      .groupBy('campaign.id')
      .addGroupBy('campaign.title')
      .addGroupBy('campaign.tagline')
      .addGroupBy('campaign.status')
      .addGroupBy('campaign.publishedAt')
      .addGroupBy('campaign.goal')
      .addGroupBy('campaign.duration')
      .addGroupBy('owner.id')
      .addGroupBy('owner.fullName')
      .addGroupBy('field.name')
      .addGroupBy('fieldGroup.name');
    // Phân trang
    const [results, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    for (let i = 0; i < results.length; i++) {
      const campaign = results[i];
      const total = await this.repository.contribution
        .createQueryBuilder('contribution')
        .select('SUM(contribution.amount)', 'totalAmount')
        .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
        .andWhere('contribution.status = :status', {
          status: PaymentStatus.SUCCESS,
        })
        .getRawOne();
      campaign['currentMoney'] = Number(total?.totalAmount || 0);

      const endDate = new Date(campaign.publishedAt);
      endDate.setDate(endDate.getDate() + campaign.duration); // Cộng duration vào publishedAt

      // Tính thời gian còn lại (milliseconds)
      const currentTime = new Date();
      const remainingHours = Math.ceil(
        (endDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
      );
      let daysLeft = '';
      if (remainingHours > 24) daysLeft = Math.ceil(remainingHours / 24) + ' ngày';
      else if (remainingHours > 0) {
        daysLeft = Math.ceil(remainingHours) + ' giờ';
      } else daysLeft = 'Hết hạn';
      campaign['daysLeft'] = daysLeft;
      campaign['percentProgress'] = (campaign['currentMoney'] / campaign.goal) * 100;
    }
    if (criteria === 'most') {
      results.sort((a, b) => b['currentMoney'] - a['currentMoney']);
    }

    const failedCampaigns = results.filter((campaign) => campaign.status === CampaignStatus.FAILED);
    const nonFailedCampaigns = results.filter(
      (campaign) => campaign.status !== CampaignStatus.FAILED,
    );

    return {
      campaigns: [...nonFailedCampaigns, ...failedCampaigns],
      totalPages,
      page,
      limit,
    };
  }

  async getCampaignsExplore2(campaignExplorePaginationDto: CampaignExplorePaginationDto) {
    const {
      page = 1,
      limit = 10,
      searchString,
      status,
      field,
      criteria,
      fieldGroup,
    } = campaignExplorePaginationDto;

    const from = (page - 1) * limit; // Tính toán vị trí bắt đầu
    const size = limit; // Số lượng kết quả mỗi trang

    const isEmailPattern = searchString?.includes('@') || false;

    const query: QueryDslQueryContainer = {
      bool: {
        must: [
          ...(field && field !== 'Tất cả'
            ? [
                {
                  match_phrase: {
                    field: {
                      query: field,
                      boost: 2,
                    },
                  },
                },
              ]
            : []),

          // Kiểm tra điều kiện cho fieldGroup
          ...(fieldGroup && fieldGroup !== 'Tất cả'
            ? [
                {
                  match_phrase: {
                    fieldGroup: {
                      query: fieldGroup,
                      boost: 2,
                    },
                  },
                },
              ]
            : []),

          ...(status !== 'Tất cả'
            ? [
                {
                  match_phrase: {
                    status: {
                      query: status,
                      boost: 2,
                    },
                  },
                },
              ]
            : []),
        ].filter(Boolean) as QueryDslQueryContainer[],
        should: searchString.trim()
          ? ([
              {
                match: {
                  title: {
                    query: searchString,
                    boost: 3,
                    operator: 'or',
                  },
                },
              },
              {
                match: {
                  tagline: {
                    query: searchString,
                    boost: 1,
                    operator: 'or',
                  },
                },
              },
              {
                match: {
                  story: {
                    query: searchString,
                    operator: 'or',
                  },
                },
              },
              {
                match: {
                  location: {
                    query: searchString,
                    operator: 'and',
                  },
                },
              },

              {
                match: {
                  authorName: {
                    query: searchString,
                    boost: 2,
                    operator: 'or',
                  },
                },
              },
              isEmailPattern && {
                wildcard: {
                  authorEmail: {
                    value: `*${searchString}*`,
                    boost: 3,
                  },
                },
              },
            ].filter(Boolean) as QueryDslQueryContainer[])
          : [],
        minimum_should_match: searchString.trim() ? 1 : 0,
      },
    };
    const sortCriteria = criteria === 'new' ? [{ publishedAt: 'desc' }] : [];

    const result = await this.searchService.search(
      CAMPAIGN_INDEX_NAME,
      query,
      from,
      size,
      sortCriteria,
    );
    let totalHits = 0;
    if (typeof result.hits.total === 'object') {
      totalHits = result.hits.total.value;
    } else if (typeof result.hits.total === 'number') {
      totalHits = result.hits.total;
    } else {
      totalHits = 0;
    }

    const campaigns = await Promise.all(
      result.hits.hits.map(async (hit) => {
        const campaign = hit._source as Campaign;
        const endDate = new Date(campaign.publishedAt);
        endDate.setDate(endDate.getDate() + campaign.duration);
        const currentTime = new Date();
        const remainingHours = Math.ceil(
          (endDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
        );
        let daysLeft = '';
        if (remainingHours > 24) daysLeft = Math.ceil(remainingHours / 24) + ' ngày';
        else if (remainingHours > 0) daysLeft = Math.ceil(remainingHours) + ' giờ';
        else daysLeft = 'Hết hạn';

        const total = await this.repository.contribution
          .createQueryBuilder('contribution')
          .select('SUM(contribution.amount)', 'totalAmount')
          .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
          .andWhere('contribution.status = :status', {
            status: PaymentStatus.SUCCESS,
          })
          .getRawOne();
        const currentMoney = Number(total?.totalAmount || 0);

        const percentProgress = (currentMoney / campaign.goal) * 100;
        campaign['percentProgress'] = percentProgress;
        campaign['daysLeft'] = daysLeft;
        campaign['currentMoney'] = currentMoney;
        return campaign;
      }),
    );
    if (criteria === 'most') {
      campaigns.sort((a, b) => b['currentMoney'] - a['currentMoney']);
    }
    const failedCampaigns = campaigns.filter((c) => c['status'] === CampaignStatus.FAILED);
    const nonFailedCampaigns = campaigns.filter((c) => c['status'] !== CampaignStatus.FAILED);
    return {
      campaigns: [...nonFailedCampaigns, ...failedCampaigns],
      totalPages: Math.ceil(totalHits / limit),
      page,
      limit,
    };
  }

  async createCampaign(user: ITokenPayload) {
    const newCampagin = this.repository.campaign.create({
      status: CampaignStatus.DRAFT,
      ownerId: user.id,
    });
    return await this.repository.campaign.save(newCampagin);
  }

  async getQuantitySuccessCampaignByCampaignId(campaignId: string) {
    const campaign = await this.repository.campaign.findOneBy({ id: campaignId });
    if (!campaign) throw new BadRequestException('Chiến dịch không tồn tại');
    const ownerId = campaign.ownerId;
    const res = await this.repository.campaign.findAndCount({
      where: {
        owner: {
          id: ownerId,
        },
        status: CampaignStatus.SUCCESS,
      },
    });
    const number = res[1];
    return number;
  }

  async getQuantitySuccessCampaignOfUser(userId: string) {
    const res = await this.repository.campaign.findAndCount({
      where: {
        owner: {
          id: userId,
        },
        status: CampaignStatus.SUCCESS,
      },
    });
    const number = res[1];
    return number;
  }

  async checkOwner(campaignId: string, user: ITokenPayload) {
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
    let updateCampaignOnESBody: IUpdateCampaignES = {};

    if (file) {
      if (!imageTypeName) throw new BadRequestException('Vui lòng bổ sung loại hình ảnh');
      const url = campaign[imageTypeName];
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      dataUpdate[imageTypeName] = res.secure_url as string;

      if (imageTypeName === 'cardImage') {
        updateCampaignOnESBody.cardImage = dataUpdate[imageTypeName];
      }
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

    if (fieldId) {
      const field = await this.repository.field.findOne({
        where: {
          id: fieldId,
        },
        relations: {
          fieldGroup: true,
        },
      });

      updateCampaignOnESBody.field = field.name;
      updateCampaignOnESBody.fieldGroup = field.fieldGroup.name;
    }
    const allowedKeys = ['title', 'tagline', 'location', 'duration', 'goal', 'story'];
    const filteredData = Object.fromEntries(
      Object.entries(dataUpdate).filter(([key]) => allowedKeys.includes(key)),
    );

    updateCampaignOnESBody = {
      ...updateCampaignOnESBody,
      ...filteredData,
    };

    if (campaign.status !== CampaignStatus.DRAFT) {
      this.searchService.updateCampaignOnES(campaign.id, updateCampaignOnESBody);
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
    const _user = await this.repository.user.findOneBy({ id: user.id });
    if (_user.userStatus === UserStatus.INACTIVATE)
      throw new BadRequestException('Tài khoản của bạn hiện đã bị khóa');
    return await this.repository.campaign.update(campaignId, {
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

  async getCampaignsOfMember(userId: string) {
    const memberCampaigns = await this.repository.teamMember.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        campaign: {
          teamMembers: {
            user: true,
          },
          owner: true,
        },
      },
    });

    return memberCampaigns.map((memberCampaign) => ({
      ...memberCampaign.campaign,
      role: memberCampaign.role,
      isEdit: memberCampaign.isEdit,
      confirmStatus: memberCampaign.confirmStatus,
    }));
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

  async getPopularCampaigns() {
    const campaigns = await this.repository.campaign
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.contributions', 'contribution')
      .leftJoinAndSelect('campaign.field', 'field')
      .leftJoinAndSelect('field.fieldGroup', 'fieldGroup')
      .where('campaign.status = :status', { status: CampaignStatus.FUNDING })
      .andWhere('campaign.deletedAt IS NULL')
      .groupBy('campaign.id')
      .addGroupBy('campaign.title')
      .addGroupBy('campaign.cardImage')
      .addGroupBy('campaign.tagline')
      .addGroupBy('campaign.status')
      .addGroupBy('campaign.publishedAt')
      .addGroupBy('campaign.goal')
      .addGroupBy('campaign.duration')
      .addGroupBy('field.name')
      .addGroupBy('field.id')
      .addGroupBy('fieldGroup.name')
      .addGroupBy('fieldGroup.id')
      .limit(10)
      .select([
        'campaign.id',
        'campaign.title',
        'campaign.tagline',
        'campaign.cardImage',
        'campaign.status',
        'campaign.publishedAt',
        'campaign.goal',
        'campaign.duration',
        'field.name',
        'fieldGroup.name',
        'COUNT(contribution.id) AS contributionCount',
      ])
      .getMany();

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const total = await this.repository.contribution
        .createQueryBuilder('contribution')
        .select('SUM(contribution.amount)', 'totalAmount')
        .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
        .andWhere('contribution.status = :status', {
          status: PaymentStatus.SUCCESS,
        })
        .getRawOne();
      campaign['currentMoney'] = total ? Number(total.totalAmount) : 0;

      const endDate = new Date(campaign.publishedAt);
      endDate.setDate(endDate.getDate() + campaign.duration); // Cộng duration vào publishedAt

      // Tính thời gian còn lại (milliseconds)
      const currentTime = new Date();
      const remainingHours = Math.ceil(
        (endDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
      );
      let daysLeft = '';
      if (remainingHours > 24) daysLeft = Math.ceil(remainingHours / 24) + ' ngày';
      else if (remainingHours > 0) {
        daysLeft = Math.ceil(remainingHours) + ' giờ';
      } else daysLeft = 'Hết hạn';
      campaign['daysLeft'] = daysLeft;
      campaign['percentProgress'] = (campaign['currentMoney'] / campaign.goal) * 100;
    }
    return campaigns;
  }

  findOneById(id: string) {
    return this.repository.campaign.findOneBy({
      id,
    });
  }

  async findOneDetail(id: string) {
    const campaign = await this.repository.campaign.findOne({
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
          id: true,
          email: true,
          avatar: true,
          fullName: true,
          verifyStatus: true,
        },
      },
    });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');

    const result = await this.repository.contribution
      .createQueryBuilder('contribution')
      .select('SUM(contribution.amount)', 'totalAmount')
      .addSelect('COUNT(contribution.id)', 'totalContributions')
      .where('contribution.campaignId = :campaignId', { campaignId: campaign.id })
      .andWhere('contribution.status = :status', {
        status: PaymentStatus.SUCCESS,
      })
      .getRawOne();
    const totalAmount = result.totalAmount;
    const totalContributions = result.totalContributions;
    campaign['currentMoney'] = totalAmount ? Number(totalAmount) : 0;
    campaign['totalContributions'] = totalContributions ? Number(totalContributions) : 0;

    const endDate = new Date(campaign.publishedAt);
    endDate.setDate(endDate.getDate() + campaign.duration); // Cộng duration vào publishedAt

    // Tính thời gian còn lại (milliseconds)
    const currentTime = new Date();
    const remainingHours = Math.ceil(
      (endDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60),
    );
    let daysLeft = '';
    if (remainingHours > 24) daysLeft = Math.ceil(remainingHours / 24) + ' ngày';
    else if (remainingHours > 0) {
      daysLeft = Math.ceil(remainingHours) + ' giờ';
    } else daysLeft = 'Hết hạn';
    campaign['daysLeft'] = daysLeft;
    campaign['percentProgress'] = (campaign['currentMoney'] / campaign.goal) * 100;

    return campaign;
  }

  async CKEUpload(file: Express.Multer.File) {
    const res = await this.cloudinaryService.uploadFile(file, envs.cloudinary.cke_folder_name);
    return res.secure_url as string;
  }

  async adminChangeStatus(
    campaignId: string,
    status: CampaignStatus.TERMINATE | CampaignStatus.FUNDING,
  ) {
    const campaign = await this.repository.campaign.findOne({
      where: {
        id: campaignId,
      },
      relations: {
        owner: true,
      },
    });
    if (!campaign) throw new NotFoundException('Chiến dịch không tồn tại');
    if (campaign.status === CampaignStatus.PENDING && status === CampaignStatus.FUNDING) {
      campaign.publishedAt = new Date();
      this.emailService.sendFundingEmail({
        email: campaign.owner.email,
        campaignTitle: campaign.title,
      });

      this.searchService.addCampaignToES({
        ...campaign,
        status: CampaignStatus.FUNDING,
      });
    }
    if (campaign.status === CampaignStatus.TERMINATE && status === CampaignStatus.FUNDING) {
      this.emailService.sendReFundingEmail({
        email: campaign.owner.email,
        campaignTitle: campaign.title,
      });
      this.searchService.updateCampaignOnES(campaign.id, {
        status,
      });
    } else if (status === CampaignStatus.TERMINATE) {
      this.emailService.sendTerminateEmail({
        email: campaign.owner.email,
        campaignTitle: campaign.title,
      });
      this.searchService.updateCampaignOnES(campaign.id, {
        status,
      });
    }
    campaign.status = status;

    return await this.repository.campaign.save(campaign);
  }
}
