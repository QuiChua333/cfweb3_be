import { Injectable } from '@nestjs/common';
import { RepositoryService } from '@/repositories/repository.service';
import { AllFieldDto, CreateFieldDto, UpdateFieldDto } from './dto';
import { ILike } from 'typeorm';

@Injectable()
export class FieldService {
  constructor(
    private readonly repository: RepositoryService
  ) {}

  async getAllByFieldGroupId(queryParam: AllFieldDto) {
    const { textSearch = '', page = 1 } = queryParam;
    const idFieldGroup = queryParam.idFieldGroup;
    const limit = 10;
    const skip = (page - 1) * limit;

    if (!idFieldGroup) {
      throw new Error("idFieldGroup is required");
    }

    const whereCondition = {
      fieldGroup: { id: idFieldGroup },
      ...(textSearch ? { name: ILike(`%${textSearch}%`) } : {}),
    };

    const [fields, totalCount] = await this.repository.field.findAndCount({
      where: whereCondition,
      relations: ['campaigns'],
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    const result = fields.map(field => ({
      id: field.id,
      name: field.name,
      campaignCount: field.campaigns.length,
    }));

    return {
      data: result,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalItems: totalCount,
    };
  }


  async getFieldsGroupByCategory() {
    const listFieldsGroupByCategory = await this.repository.fieldGroup.find({
      relations: {
        fields: true,
      },
      select: {
        id: true,
        name: true,
        fields: {
          id: true,
          name: true,
        },
      },
    });
    return listFieldsGroupByCategory;
  }

  async getDetail(id: string) {
    const field = await this.repository.field.findOne({ where: { id } });
    if (!field) throw new Error('Field not found');
    return field;
  }

  async create(dto: CreateFieldDto) {
    const fieldGroup = await this.repository.fieldGroup.findOne({ where: { id: dto.fieldGroupId } });
    if (!fieldGroup) throw new Error('FieldGroup not found');

    const existingField = await this.repository.field.findOne({ where: { name: dto.name } });
    if (existingField) {
        throw new Error(`Field with name '${dto.name}' already exists`);
    }

    const field = this.repository.field.create({ name: dto.name, fieldGroup });
    return this.repository.field.save(field);
  }

  async update(id: string, dto: UpdateFieldDto) {
    const field = await this.repository.field.findOne({ where: { id } });
    if (!field) throw new Error('Field not found');

    if (dto.fieldGroupId) {
      const fieldGroup = await this.repository.fieldGroup.findOne({ where: { id: dto.fieldGroupId } });
      if (!fieldGroup) throw new Error('FieldGroup not found');
      field.fieldGroup = fieldGroup;
    }
    
    if (dto.name) field.name = dto.name;
    return this.repository.field.save(field);
  }

  async delete(id: string) {
    return await this.repository.field.delete(id);
  }
}
