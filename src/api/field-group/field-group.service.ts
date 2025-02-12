import { BadRequestException, Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { AllFieldGroupDto, CreateFieldGroupDto, UpdateFieldGroupDto } from './dto';
import { ILike } from 'typeorm';

@Injectable()
export class FieldGroupService {
  constructor(private readonly repository: RepositoryService) {}

  async getAll(queryParam: AllFieldGroupDto) {
    const { textSearch = '', page = 1 } = queryParam;
    const limit = 10;
    const skip = (page - 1) * limit;
  
    const whereCondition = textSearch
      ? { name: ILike(`%${textSearch}%`) }
      : {};
  
    const [fieldGroups, totalCount] = await this.repository.fieldGroup.findAndCount({
      where: whereCondition,
      relations: ['fields'],
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });
  
    return {
      data: fieldGroups.map((fieldGroup) => ({
        ...fieldGroup,
        fieldCount: fieldGroup.fields.length,
      })),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalItems: totalCount,
    };
  }
  

  async getDetail(id: string) {
    const fieldGroup = await this.repository.fieldGroup.findOne({
      where: { id },
      relations: ['fields'],
    });
  
    if (!fieldGroup) return null;
  
    return {
      ...fieldGroup,
      fieldCount: fieldGroup.fields.length,
    };
  }
  

  async create(dto: CreateFieldGroupDto) {
    const existingFieldGroup = await this.repository.fieldGroup.findOne({ where: { name: dto.name } });
    if (existingFieldGroup) {
      throw new BadRequestException(`Nhóm lĩnh vực '${dto.name}' này đã tồn tại. Vui lòng thêm một cái khác.`);
    }
  
    const fieldGroup = this.repository.fieldGroup.create(dto);
    return await this.repository.fieldGroup.save(fieldGroup);
  }
  

  async update(id: string, dto: UpdateFieldGroupDto) {
    const fieldGroup = await this.repository.fieldGroup.findOne({ where: { id } });
    if (!fieldGroup) throw new BadRequestException('FieldGroup not found');
  
    if (dto.name && dto.name !== fieldGroup.name) {
      const existingFieldGroup = await this.repository.fieldGroup.findOne({ where: { name: dto.name } });
      if (existingFieldGroup) {
        throw new BadRequestException(`Nhóm lĩnh vực '${dto.name}' này đã tồn tại. Vui lòng thêm một cái khác.`);
        
      }
    }
  
    await this.repository.fieldGroup.update(id, dto);
    return this.repository.fieldGroup.findOne({ where: { id } });
  }
  

  async delete(id: string) {
    return await this.repository.fieldGroup.delete(id);
  }
}
