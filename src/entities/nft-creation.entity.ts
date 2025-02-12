import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { NFT } from './nft.entity';
import { Campaign } from './campaign.entity';

@Entity()
export class NFTCreateion extends BaseEntity {
  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column({
    default: '',
  })
  description: string;

  @Column()
  price: number;

  @Column()
  ethPrice: string;

  @Column()
  image: string;

  @Column()
  color: string;

  @Column()
  supply: number;

  @Column()
  materials: string;

  @Column()
  styles: string;

  @Column({
    nullable: true,
  })
  transactionHash: string;

  @Column({
    nullable: true,
  })
  contractAddress: string;

  @Column({
    nullable: true,
  })
  authorAddress: string;

  @Column()
  factoryContractAddress: string;

  @Column({
    nullable: true,
  })
  metadataLink: string;

  @Column()
  transactionHash: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  uri: string;

  @Column({
    default: false,
  })
  createdSuccess: boolean;

  @OneToMany(() => NFT, (nft) => nft.nftCreation)
  nfts: NFT;

  @ManyToOne(() => Campaign, (campaign) => campaign.nftCreations)
  campaign: Campaign;
}
