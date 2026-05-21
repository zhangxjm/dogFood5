import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';

@ApiTags('数据统计')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('monthly')
  @ApiOperation({ summary: '获取月度统计数据' })
  @ApiQuery({ name: 'year', required: true, description: '年份' })
  @ApiQuery({ name: 'month', required: true, description: '月份 (1-12)' })
  async getMonthlyStatistics(
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return await this.statisticsService.getMonthlyStatistics(parseInt(year), parseInt(month));
  }
}
