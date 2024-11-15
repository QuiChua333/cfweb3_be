import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Campaign } from './campaign.entity';
import { User } from './user.entity';
import { ReportResponse } from './report-response.entity';
import { ReportStatus } from '@/constants';

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

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.NO_RESPONSE,
  })
  status: ReportStatus;

  @ManyToOne(() => Campaign, (campaign) => campaign.reports)
  campaign: Campaign;

  @ManyToOne(() => User, (user) => user.reports)
  reportBy: User;

  @OneToOne(() => ReportResponse, (reportResponse) => reportResponse.report, {
    cascade: true,
  })
  reportResponse: ReportResponse;
}
