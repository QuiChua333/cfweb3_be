import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Report } from './report.entity';

@Entity()
export class ReportResponse extends BaseEntity {
  @Column()
  content: string;

  @Column()
  date: Date;

  @Column()
  image: string;

  @OneToOne(() => Report, (report) => report.reportResponse)
  @JoinColumn()
  report: Report;
}
