import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class FaqService {
  constructor(private readonly repository: RepositoryService) {}

  findAll() {
    return `This action returns all faq`;
  }
}
