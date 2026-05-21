import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { CheckIn } from './entities/check-in.entity';

@ApiTags('打卡记录')
@Controller('check-ins')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  @ApiOperation({ summary: '创建打卡记录' })
  async create(@Body() createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    return await this.checkInService.create(createCheckInDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有打卡记录' })
  @ApiQuery({ name: 'date', required: false, description: '按日期查询 YYYY-MM-DD' })
  @ApiQuery({ name: 'startDate', required: false, description: '开始日期 YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, description: '结束日期 YYYY-MM-DD' })
  async findAll(
    @Query('date') date?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CheckIn[]> {
    if (date) {
      return await this.checkInService.findByDate(date);
    }
    if (startDate && endDate) {
      return await this.checkInService.findByDateRange(startDate, endDate);
    }
    return await this.checkInService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个打卡记录' })
  async findOne(@Param('id') id: string): Promise<CheckIn> {
    return await this.checkInService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除打卡记录' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.checkInService.remove(+id);
  }
}
