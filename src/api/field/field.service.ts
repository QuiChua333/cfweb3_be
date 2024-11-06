import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class FieldService {
  constructor(private readonly repository: RepositoryService) {}

  async getFieldsGroupByCategory() {
    const listFieldsGroupByCategory = await this.repository.fieldGroup.find({
      relations: ['fields'],
    });
  }
}
