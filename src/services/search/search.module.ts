import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { envs } from '@/config';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: envs.es.node,
      requestTimeout: 60000,
      maxRetries: 10,
    }),
  ],
  controllers: [],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
