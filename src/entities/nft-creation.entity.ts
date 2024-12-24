import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { NFTCurrency } from '@/constants';
import { Perk } from './perk.entity';
import { NFT } from './nft.entity';

@Entity()
export class NFTCreateion extends BaseEntity {
  @Column({
    nullable: true,
  })
  nftContractAddress: string;

  @Column()
  authorAddress: string;

  @Column()
  factoryContractAddress: string;

  @Column()
  metadataLink: string;

  @Column()
  transactionHash: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column({
    nullable: true,
  })
  currency: NFTCurrency;

  @Column({
    type: 'float',
    nullable: true,
  })
  price: number;

  @OneToOne(() => Perk, (perk) => perk.nftCreation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  perk: Perk;

  @OneToMany(() => NFT, (nft) => nft.nftCreation)
  nfts: NFT;
}
