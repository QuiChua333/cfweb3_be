import { CampaignStatus } from '@/constants';

export interface IUpdateCampaignES {
  status?: CampaignStatus;
  title?: string;
  tagline?: string;
  location?: string;
  duration?: number;
  goal?: number;
  authorName?: string;
  authorEmail?: string;
  field?: string;
  fieldGroup?: string;
  story?: string;
  cardImage?: string;
}
