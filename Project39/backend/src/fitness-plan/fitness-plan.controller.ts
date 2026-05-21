import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FitnessPlanService } from './fitness-plan.service';
import { CreateFitnessPlanDto } from './dto/create-fitness-plan.dto';
import { UpdateFitnessPlanDto } from './dto/update-fitness-plan.dto';
import { FitnessPlan } from './entities/fitness-plan.entity';

@ApiTags('健身方案')
@Controller('fitness-plans')
export class FitnessPlanController {
  constructor(private readonly fitnessPlanService: FitnessPlanService) {}

  @Post()
  @ApiOperation({ summary: '创建健身方案' })
  async create(@Body() createFitnessPlanDto: CreateFitnessPlanDto): Promise<FitnessPlan> {
    return await this.fitnessPlanService.create(createFitnessPlanDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有健身方案' })
  async findAll(): Promise<FitnessPlan[]> {
    return await this.fitnessPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个健身方案' })
  async findOne(@Param('id') id: string): Promise<FitnessPlan> {
    return await this.fitnessPlanService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新健身方案' })
  async update(
    @Param('id') id: string,
    @Body() updateFitnessPlanDto: UpdateFitnessPlanDto,
  ): Promise<FitnessPlan> {
    return await this.fitnessPlanService.update(+id, updateFitnessPlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除健身方案' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.fitnessPlanService.remove(+id);
  }
}
