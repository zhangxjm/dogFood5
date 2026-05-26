import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { FitnessPlanService } from './fitness-plan.service';
import { CreateFitnessPlanDto, UpdateFitnessPlanDto } from './dto/fitness-plan.dto';
import { FitnessPlan } from '../../entities/fitness-plan.entity';

@Controller('api/fitness-plans')
export class FitnessPlanController {
  constructor(private readonly fitnessPlanService: FitnessPlanService) {}

  @Get()
  findAll(): Promise<FitnessPlan[]> {
    return this.fitnessPlanService.findAll();
  }

  @Get('active')
  findActive(): Promise<FitnessPlan[]> {
    return this.fitnessPlanService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<FitnessPlan> {
    return this.fitnessPlanService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateFitnessPlanDto): Promise<FitnessPlan> {
    return this.fitnessPlanService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateFitnessPlanDto): Promise<FitnessPlan> {
    return this.fitnessPlanService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.fitnessPlanService.remove(+id);
  }

  @Put(':id/toggle')
  toggleActive(@Param('id') id: string): Promise<FitnessPlan> {
    return this.fitnessPlanService.toggleActive(+id);
  }
}
