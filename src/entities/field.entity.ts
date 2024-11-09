import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Perk } from './perk.entity';
import { FieldGroup } from './field-group.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class Field extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne(() => FieldGroup, (fieldGroup) => fieldGroup.fields)
  fieldGroup: FieldGroup;

  @OneToMany(() => Campaign, (campaign) => campaign.field)
  campaigns: Campaign[];
}
