import { Injectable } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class ContributionService {
  constructor(private readonly repository: RepositoryService) {}
  create(createContributionDto: CreateContributionDto) {
    return 'This action adds a new contribution';
  }

  findAll() {
    return `This action returns all contribution`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contribution`;
  }

  update(id: number, updateContributionDto: UpdateContributionDto) {
    return `This action updates a #${id} contribution`;
  }

  remove(id: number) {
    return `This action removes a #${id} contribution`;
  }
}