import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Perk } from './perk.entity';
import { Field } from './field.entity';

@Entity()
export class FieldGroup extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Field, (field) => field.fieldGroup)
  fields: Field[];
}
