import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { NFTCurrency } from '@/constants';
import { NFTCreateion } from './nft-creation.entity';

@Entity()
export class NFT extends BaseEntity {
  @Column()
  nftContractAddress: string;

  @Column()
  transactionHash: string;

  @Column()
  ownerAddress: string;

  @Column()
  tokenId: string;

  @Column()
  uri: string;

  @Column({
    nullable: true,
  })
  currency: NFTCurrency;

  @Column({
    type: 'float',
    nullable: true,
  })
  price: number;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  metadataInfo: Object;

  @ManyToOne(() => NFTCreateion, (nftCreation) => nftCreation.nfts)
  nftCreation: NFTCreateion;
}

// metadataInfo = {
//   image:
//     'https://res.cloudinary.com/dlotmnagu/image/upload/v1731033477/CROWDFUNDING/qvrih7ja9gxpjmxmr1e9.jpg',
//   name: 'Đặc quyền 2',
//   quantity: 1,
//   options: [{ name: 'Vật phẩm Quí', quantity: 5, optionsString: 'xanh|s' }],
// };
