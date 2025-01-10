import { CAMPAIGN_INDEX_NAME, CampaignStatus } from '@/constants';
import { ESCampaignMapping } from '@/entities';
import { RepositoryService } from '@/repositories/repository.service';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Not } from 'typeorm';

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly repository: RepositoryService,
  ) {}

  async onModuleInit() {
    this.createCampaignIndex();
  }

  async createCampaignIndex() {
    const campaignIndexName = CAMPAIGN_INDEX_NAME;
    const checkIndex = await this.elasticsearchService.indices.exists({
      index: campaignIndexName,
    });
    if (!checkIndex) {
      await this.elasticsearchService.indices.create({
        index: campaignIndexName,
        body: {
          mappings: ESCampaignMapping,
        },
      });

      const campaigns = await this.repository.campaign.find({
        where: {
          status: Not(CampaignStatus.DRAFT),
        },
        relations: {
          owner: true,
          field: {
            fieldGroup: true,
          },
        },
      });

      const body = campaigns.flatMap((campaign) => [
        { index: { _index: campaignIndexName, _id: campaign.id } },
        {
          id: campaign.id,
          title: campaign.title,
          tagline: campaign.tagline,
          location: campaign.location,
          status: campaign.status,
          publishedAt: campaign.publishedAt,
          duration: campaign.duration,
          goal: campaign.goal,
          authorName: campaign.owner.fullName,
          authorEmail: campaign.owner.email,
          field: campaign.field.name,
          fieldGroup: campaign.field.fieldGroup.name,
          story: campaign.story,
          cardImage: campaign.cardImage,
        },
      ]);

      const response = await this.elasticsearchService.bulk({
        body,
      });

      if (response.errors) {
        console.log('Errors occurred:', response.errors);
      } else {
        console.log('Bulk insert successful');
      }
    }
  }

  async addCampaignToES() {}

  async search(
    index: string,
    query: QueryDslQueryContainer,
    from: number,
    size: number,
    sort?: any[],
  ) {
    return await this.elasticsearchService.search({
      index,
      query,
      from,
      size,
      track_total_hits: true,
      ...(sort ? { sort } : {}),
    });
  }
}
