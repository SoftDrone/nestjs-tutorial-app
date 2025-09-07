import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}
  
  // @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateResultDto) {
    const userId = 18;//req.user.id;
    return this.resultsService.create(dto, userId);
  }

  @Post('/fromMistakes')
  async createFromMistakes(@Body() dto: {answers: Record<string, number>}) {
    // const userId = 18;//req.user.id;
    return this.resultsService.createFromMistakes(dto);
  }

  @Get()
  findAll() {
    return this.resultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
    return this.resultsService.update(+id, updateResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resultsService.remove(+id);
  }
}
