import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { CryptoCurrency } from '@/constants';
import { NFTCreateion } from './nft-creation.entity';
import { User } from './user.entity';

@Entity()
export class NFT extends BaseEntity {
  @Column({
    nullable: true,
  })
  ownerAddress: string;

  @Column({
    type: 'bigint',
  })
  tokenId: number;

  @Column()
  uri: string;

  @Column({
    default: false,
  })
  isMinted: boolean;

  @ManyToOne(() => NFTCreateion, (nftCreation) => nftCreation.nfts)
  nftCreation: NFTCreateion;

  @ManyToOne(() => User, (user) => user.nfts, { nullable: true })
  user: User;
}

// metadataInfo = {
//   image:
//     'https://res.cloudinary.com/dlotmnagu/image/upload/v1731033477/CROWDFUNDING/qvrih7ja9gxpjmxmr1e9.jpg',
//   name: 'Đặc quyền 2',
//   quantity: 1,
//   options: [{ name: 'Vật phẩm Quí', quantity: 5, optionsString: 'xanh|s' }],
// };
