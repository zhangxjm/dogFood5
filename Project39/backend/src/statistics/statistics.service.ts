import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckIn } from '../check-in/entities/check-in.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkInRepository: Repository<CheckIn>,
  ) {}

  async getMonthlyStatistics(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const checkIns = await this.checkInRepository.find({
      where: { checkInDate: Between(startDate, endDate) },
      relations: ['plan'],
    });

    const totalCheckIns = checkIns.length;
    const totalCalories = checkIns.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0);
    const totalDuration = checkIns.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);

    const dailyStats = this.groupByDate(checkIns);
    const planStats = this.groupByPlan(checkIns);

    return {
      year,
      month,
      summary: {
        totalCheckIns,
        totalCalories,
        totalDuration,
        averageCaloriesPerDay: totalCheckIns > 0 ? Math.round(totalCalories / totalCheckIns) : 0,
        averageDurationPerDay: totalCheckIns > 0 ? Math.round(totalDuration / totalCheckIns) : 0,
      },
      dailyStats,
      planStats,
      checkIns,
    };
  }

  private groupByDate(checkIns: CheckIn[]) {
    const grouped: Record<string, any> = {};
    
    checkIns.forEach(checkIn => {
      const date = checkIn.checkInDate;
      if (!grouped[date]) {
        grouped[date] = {
          date,
          checkInCount: 0,
          totalCalories: 0,
          totalDuration: 0,
        };
      }
      grouped[date].checkInCount++;
      grouped[date].totalCalories += checkIn.caloriesBurned || 0;
      grouped[date].totalDuration += checkIn.durationMinutes || 0;
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  }

  private groupByPlan(checkIns: CheckIn[]) {
    const grouped: Record<number, any> = {};
    
    checkIns.forEach(checkIn => {
      const planId = checkIn.planId;
      if (!grouped[planId]) {
        grouped[planId] = {
          planId,
          planName: checkIn.plan?.name || 'Unknown',
          checkInCount: 0,
          totalCalories: 0,
          totalDuration: 0,
        };
      }
      grouped[planId].checkInCount++;
      grouped[planId].totalCalories += checkIn.caloriesBurned || 0;
      grouped[planId].totalDuration += checkIn.durationMinutes || 0;
    });

    return Object.values(grouped).sort((a, b) => b.checkInCount - a.checkInCount);
  }
}
