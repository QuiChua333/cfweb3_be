import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailPerkDto } from './create-detail-perk.dto';

export class UpdateDetailPerkDto extends PartialType(CreateDetailPerkDto) {}
