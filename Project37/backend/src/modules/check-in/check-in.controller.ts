import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto, UpdateCheckInDto } from './dto/check-in.dto';
import { CheckIn } from '../../entities/check-in.entity';

@Controller('api/check-ins')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Get()
  findAll(
    @Query('fitnessPlanId') fitnessPlanId?: string,
    @Query('date') date?: string,
  ): Promise<CheckIn[]> {
    return this.checkInService.findAll(fitnessPlanId ? +fitnessPlanId : undefined, date);
  }

  @Get('today/:fitnessPlanId')
  getTodayCheckIn(@Param('fitnessPlanId') fitnessPlanId: string): Promise<CheckIn | null> {
    return this.checkInService.getTodayCheckIn(+fitnessPlanId);
  }

  @Get('month/:fitnessPlanId')
  findByMonth(
    @Param('fitnessPlanId') fitnessPlanId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<CheckIn[]> {
    return this.checkInService.findByMonth(+fitnessPlanId, +year, +month);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CheckIn> {
    return this.checkInService.findOne(+id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateCheckInDto): Promise<CheckIn> {
    return this.checkInService.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCheckInDto): Promise<CheckIn> {
    return this.checkInService.update(+id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.checkInService.remove(+id);
  }
}
