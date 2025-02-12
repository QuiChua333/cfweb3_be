import { PaginationDto } from '@/common/dto';
import { PartialType } from '@nestjs/mapped-types';

export class NFTPaginationDto extends PartialType(PaginationDto) {}
