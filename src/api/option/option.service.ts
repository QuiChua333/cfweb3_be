import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class OptionService {
  constructor(private readonly repository: RepositoryService) {}

  findAll() {
    return `This action returns all option`;
  }
}
