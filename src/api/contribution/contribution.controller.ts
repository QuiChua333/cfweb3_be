import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContributionService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';
import ContributionRoute from './contribution.routes';
import { InjectRoute } from '@/decorators';

@Controller(ContributionRoute.root)
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  create(@Body() createContributionDto: CreateContributionDto) {
    return this.contributionService.create(createContributionDto);
  }

  @InjectRoute(ContributionRoute.findAll)
  findAll() {
    return this.contributionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contributionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContributionDto: UpdateContributionDto) {
    return this.contributionService.update(+id, updateContributionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionService.remove(+id);
  }
}
