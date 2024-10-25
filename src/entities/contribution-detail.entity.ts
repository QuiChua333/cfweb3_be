import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Contribution } from './contribution.entity';

@Entity()
export class ContributionDetail extends BaseEntity {
  @OneToOne(() => Contribution, (contribution) => contribution.contributionDetail)
  @JoinColumn()
  contribution: Contribution;

  @Column({
    type: 'jsonb',
  })
  perks: Array<Record<string, any>>;
}
