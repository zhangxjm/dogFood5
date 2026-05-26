import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';
import { Schedule } from './schedule.entity';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  findAll(@Query('courseId') courseId?: number, @Query('date') date?: string): Promise<Schedule[]> {
    if (date) {
      return this.scheduleService.findByDate(date);
    }
    if (courseId) {
      return this.scheduleService.findByCourse(courseId);
    }
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Schedule> {
    return this.scheduleService.findOne(id);
  }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    return this.scheduleService.create(createScheduleDto);
  }

  @Post('batch')
  createBatch(@Body() createScheduleDtos: CreateScheduleDto[]): Promise<Schedule[]> {
    return this.scheduleService.createBatch(createScheduleDtos);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.scheduleService.remove(id);
  }
}
