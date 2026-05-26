import { Controller, Get, Param, Query } from '@nestjs/common';
import { SummaryService } from './summary.service';

@Controller('api/summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('monthly/:fitnessPlanId')
  getMonthlySummary(
    @Param('fitnessPlanId') fitnessPlanId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<any> {
    const now = new Date();
    return this.summaryService.getMonthlySummary(
      +fitnessPlanId,
      year ? +year : now.getFullYear(),
      month ? +month : now.getMonth() + 1,
    );
  }

  @Get('overall')
  getOverallSummary(
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<any> {
    const now = new Date();
    return this.summaryService.getOverallSummary(
      year ? +year : now.getFullYear(),
      month ? +month : now.getMonth() + 1,
    );
  }

  @Get('streak/:fitnessPlanId')
  getStreak(@Param('fitnessPlanId') fitnessPlanId: string): Promise<any> {
    return this.summaryService.getStreak(+fitnessPlanId);
  }
}
