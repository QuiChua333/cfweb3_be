import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailPerkService } from './detail-perk.service';
import { CreateDetailPerkDto } from './dto/create-detail-perk.dto';
import { UpdateDetailPerkDto } from './dto/update-detail-perk.dto';
import DetailPerkRoute from './detail-perk.routes';
import { InjectRoute } from '@/decorators';

@Controller(DetailPerkRoute.root)
export class DetailPerkController {
  constructor(private readonly detailPerkService: DetailPerkService) {}

  @Post()
  create(@Body() createDetailPerkDto: CreateDetailPerkDto) {
    return this.detailPerkService.create(createDetailPerkDto);
  }

  @InjectRoute(DetailPerkRoute.findAll)
  findAll() {
    return this.detailPerkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailPerkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailPerkDto: UpdateDetailPerkDto) {
    return this.detailPerkService.update(+id, updateDetailPerkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailPerkService.remove(+id);
  }
}
