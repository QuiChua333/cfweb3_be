import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PerkService } from './perk.service';
import { CreatePerkDto } from './dto/create-perk.dto';
import { UpdatePerkDto } from './dto/update-perk.dto';
import { InjectRoute } from '@/decorators';
import PerkRoute from './perk.routes';

@Controller('perk')
export class PerkController {
  constructor(private readonly perkService: PerkService) {}

  @Post()
  create(@Body() createPerkDto: CreatePerkDto) {
    return this.perkService.create(createPerkDto);
  }

  @InjectRoute(PerkRoute.findAll)
  findAll() {
    return this.perkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.perkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerkDto: UpdatePerkDto) {
    return this.perkService.update(+id, updatePerkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.perkService.remove(+id);
  }
}
