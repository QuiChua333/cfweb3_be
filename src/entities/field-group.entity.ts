import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Field } from './field.entity';

@Entity()
export class FieldGroup extends BaseEntity {
  @Column({
    unique: true,
  })
  name: string;

  @OneToMany(() => Field, (field) => field.fieldGroup)
  fields: Field[];
}
