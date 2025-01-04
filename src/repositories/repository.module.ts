import {
  Campaign,
  Comment,
  CommentLike,
  Contribution,
  DetailPerk,
  FAQ,
  Field,
  FieldGroup,
  FollowCampaign,
  Gift,
  Item,
  Option,
  Perk,
  Report,
  ReportResponse,
  ShippingFee,
  TeamMember,
  User,
  UserVerify,
} from '@/entities';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryService } from './repository.service';
import { NFTCreateion } from '@/entities/nft-creation.entity';
import { NFT } from '@/entities/nft.entity';
import { ChatRoom } from '@/entities/chat-room.entity';
import { Message } from '@/entities/message.entity';
import { ChatRoomUser } from '@/entities/chat-room-user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CommentLike,
      Comment,
      Contribution,
      Gift,
      DetailPerk,
      FAQ,
      FieldGroup,
      Field,
      FollowCampaign,
      Item,
      Option,
      Perk,
      ReportResponse,
      Report,
      ShippingFee,
      TeamMember,
      UserVerify,
      User,
      ChatRoom,
      Message,
      ChatRoomUser,
      NFTCreateion,
      NFT,
    ]),
  ],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
