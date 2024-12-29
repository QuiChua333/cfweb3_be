import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDto } from 'src/api/auth/dto';
import { RepositoryService } from '@/repositories/repository.service';
import { ITokenPayload } from '../auth/auth.interface';
import { UpdateProfileUserDto } from './dto';
import { CloudinaryService } from '@/services/cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';
import { UserStatus, VerifyStatus } from '@/constants';
import {
  UserPaginationDto,
  UserQueryStatus,
  UserVerifyQueryStatus,
} from './dto/user-pagination.dto';
import { Campaign, Contribution } from '@/entities';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from '@/services/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: RepositoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(userPaginationDto: UserPaginationDto) {
    const { page = 1, limit = 10, searchString, userStatus, userVerifyStatus } = userPaginationDto;

    const query = this.repository.user
      .createQueryBuilder('user')
      .andWhere('user.isAdmin = :isAdmin', {
        isAdmin: false,
      });

    // Thêm điều kiện tìm kiếm theo email hoặc fullName
    if (searchString && searchString.trim() !== '') {
      query.andWhere('(user.email ILIKE :searchString OR user.fullName ILIKE :searchString)', {
        searchString: `%${searchString}%`,
      });
    }

    // Thêm điều kiện tìm kiếm theo userStatus
    if (userStatus && userStatus !== UserQueryStatus.ALL) {
      query.andWhere('user.userStatus = :userStatus', {
        userStatus,
      });
    }

    // Thêm điều kiện tìm kiếm theo userVerifyStatus
    if (userVerifyStatus && userVerifyStatus !== UserVerifyQueryStatus.ALL) {
      query.andWhere('user.verifyStatus = :userVerifyStatus', {
        userVerifyStatus,
      });
    }
    // Thêm subquery để lấy số lượng contributions của mỗi user
    query.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(contribution.id)', 'contributionCount')
        .from(Contribution, 'contribution')
        .where('contribution.user = user.id');
    }, 'contributionCount');

    // Thêm subquery để lấy số lượng campaigns của mỗi user
    query.addSelect((subQuery) => {
      return subQuery
        .select('COUNT(campaign.id)', 'campaignCount')
        .from(Campaign, 'campaign')
        .where('campaign.owner = user.id');
    }, 'campaignCount');
    // Phân trang
    query.skip((page - 1) * limit).take(limit);

    const [users, total] = await Promise.all([query.getRawMany(), query.getCount()]);

    const totalPages = Math.ceil(total / limit);
    return {
      users: users.map((user) => ({
        id: user.user_id,
        email: user.user_email,
        fullName: user.user_fullName,
        avatar: user.user_avatar,
        userStatus: user.user_userStatus,
        verifyStatus: user.user_verifyStatus,
        isVerifiedEmail: user.user_isVerifiedEmail,
        isAdmin: user.user_isAdmin,
        contributionCount: user.contributionCount,
        campaignCount: user.campaignCount,
      })),
      totalPages,
      page,
      limit,
    };
  }

  async findOneById(id: string) {
    const user = this.repository.user.findOneBy({ id });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async findOneDetail(id: string) {
    const user = await this.repository.user.findOne({
      where: {
        id: id,
      },
      relations: {
        followCampaigns: {
          campaign: true,
        },
      },
      select: {
        followCampaigns: {
          id: true,
          campaign: {
            id: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return {
      ...user,
      followCampaigns: user.followCampaigns?.map((item) => item.campaign.id) || [],
    };
  }

  async findOneByEmail(email: string) {
    const user = this.repository.user.findOneBy({ email });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async create(registerDto: RegisterDto, isVerifiedEmail: boolean = false) {
    const newUser = this.repository.user.create({
      ...registerDto,
      isVerifiedEmail,
    });
    return this.repository.user.save(newUser);
  }

  async updateProfile(
    user: ITokenPayload,
    updateUserDto: UpdateProfileUserDto,
    file: Express.Multer.File,
  ) {
    const currentUser = await this.findOneById(user.id);
    if (file) {
      const url = currentUser.avatar;
      if (url) {
        await this.cloudinaryService.destroyFile(url);
      }
      const res = await this.cloudinaryService.uploadFile(file);
      const avatar = res.secure_url as string;
      updateUserDto['avatar'] = avatar;
    }

    return await this.repository.user.save({
      id: user.id,
      ...updateUserDto,
    });

    const newUser = await this.findOneDetail(currentUser.id);
    return newUser;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.repository.user.save({
      id: userId,
      refreshToken,
    });
  }

  async updatePassword(userId: string, password: string) {
    return this.repository.user.save({
      id: userId,
      password,
    });
  }

  async updateVerifyStatus(userId: string, status: VerifyStatus) {
    await this.repository.user.save({
      id: userId,
      verifyStatus: status,
    });
  }

  async updateVerifiedEmail(userId: string) {
    return this.repository.user.save({
      id: userId,
      isVerifiedEmail: true,
    });
  }

  async changeStatus(userId: string) {
    const user = await this.repository.user.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user.userStatus === UserStatus.ACTIVATE) {
      user.userStatus = UserStatus.INACTIVATE;
      this.emailService.sendInActivateEmail({
        email: user.email,
      });
    } else {
      user.userStatus = UserStatus.ACTIVATE;
      this.emailService.sendActivateEmail({
        email: user.email,
      });
    }

    return await this.repository.user.save(user);
  }
}
