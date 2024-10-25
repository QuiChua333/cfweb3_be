import {
  Campaign,
  Comment,
  Contribution,
  ContributionDetail,
  DetailPerk,
  FAQ,
  Field,
  FieldGroup,
  FollowCampaign,
  Item,
  Option,
  Perk,
  ReportResponse,
  ShippingFee,
  TeamMember,
  User,
  UserVerify,
} from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RepositoryService {
  constructor(
    @InjectRepository(Campaign) public readonly campaign: Repository<Campaign>,
    @InjectRepository(Comment) public readonly comment: Repository<Comment>,
    @InjectRepository(ContributionDetail)
    public readonly contributionDetail: Repository<ContributionDetail>,
    @InjectRepository(Contribution) public readonly contribution: Repository<Contribution>,
    @InjectRepository(DetailPerk) public readonly detailPerk: Repository<DetailPerk>,
    @InjectRepository(FAQ) public readonly faq: Repository<FAQ>,
    @InjectRepository(FieldGroup) public readonly fieldGroup: Repository<FieldGroup>,
    @InjectRepository(Field) public readonly field: Repository<Field>,
    @InjectRepository(FollowCampaign) public readonly followCampaign: Repository<FollowCampaign>,
    @InjectRepository(Item) public readonly item: Repository<Item>,
    @InjectRepository(Option) public readonly option: Repository<Option>,
    @InjectRepository(Perk) public readonly perk: Repository<Perk>,
    @InjectRepository(ReportResponse) public readonly reportResponse: Repository<ReportResponse>,
    @InjectRepository(ShippingFee) public readonly shippingFee: Repository<ShippingFee>,
    @InjectRepository(TeamMember) public readonly teamMember: Repository<TeamMember>,
    @InjectRepository(UserVerify) public readonly userVerify: Repository<UserVerify>,
    @InjectRepository(User) public readonly user: Repository<User>,
  ) {}
}
