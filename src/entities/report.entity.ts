import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Item } from './item.entity';
import { Campaign } from './campaign.entity';
import { User } from './user.entity';
import { ReportResponse } from './report-response.entity';

@Entity()
export class Report extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  date: Date;

  @Column()
  images: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.reports)
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.reports)
  reportBy: User;

  @OneToOne(() => ReportResponse, (reportResponse) => reportResponse.report)
  reportResponse: ReportResponse;
}
