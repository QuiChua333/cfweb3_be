import { PartialType } from '@nestjs/mapped-types';
import { CreatePerkDto } from './create-perk.dto';

export class UpdatePerkDto extends PartialType(CreatePerkDto) {}
