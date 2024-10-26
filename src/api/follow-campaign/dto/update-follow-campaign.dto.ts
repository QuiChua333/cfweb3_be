import { PartialType } from '@nestjs/mapped-types';
import { CreateFollowCampaignDto } from './create-follow-campaign.dto';

export class UpdateFollowCampaignDto extends PartialType(CreateFollowCampaignDto) {}
