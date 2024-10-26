import { Injectable } from '@nestjs/common';
import { CreateFieldGroupDto } from './dto/create-field-group.dto';
import { UpdateFieldGroupDto } from './dto/update-field-group.dto';
import { RepositoryService } from '@/repositories/repository.service';

@Injectable()
export class FieldGroupService {
  constructor(private readonly repository: RepositoryService) {}

  create(createFieldGroupDto: CreateFieldGroupDto) {
    return 'This action adds a new fieldGroup';
  }

  findAll() {
    return `This action returns all fieldGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fieldGroup`;
  }

  update(id: number, updateFieldGroupDto: UpdateFieldGroupDto) {
    return `This action updates a #${id} fieldGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldGroup`;
  }
}
