import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckIn } from '../../entities/check-in.entity';
import { FitnessPlan } from '../../entities/fitness-plan.entity';
import { startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    @InjectRepository(FitnessPlan)
    private fitnessPlanRepository: Repository<FitnessPlan>,
  ) {}

  async getMonthlySummary(fitnessPlanId: number, year: number, month: number): Promise<any> {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const checkIns = await this.checkInRepository.find({
      where: {
        fitnessPlanId,
        checkInDate: Between(start, end),
        completed: true,
      },
    });

    const fitnessPlan = await this.fitnessPlanRepository.findOne({
      where: { id: fitnessPlanId },
    });

    const totalCheckIns = checkIns.length;
    const totalCalories = checkIns.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0);
    const totalDuration = checkIns.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);
    const avgDuration = totalCheckIns > 0 ? Math.round(totalDuration / totalCheckIns) : 0;
    const targetCheckIns = Math.min(fitnessPlan?.frequencyPerWeek * 4 || 20, 31);
    const completionRate = totalCheckIns > 0 && targetCheckIns > 0
      ? Math.min(100, Math.round((totalCheckIns / targetCheckIns) * 100))
      : 0;

    const dailyData = checkIns.map(c => ({
      date: format(c.checkInDate, 'yyyy-MM-dd'),
      caloriesBurned: c.caloriesBurned,
      durationMinutes: c.durationMinutes,
    }));

    return {
      fitnessPlanId,
      fitnessPlanName: fitnessPlan?.name || 'Unknown',
      year,
      month,
      totalCheckIns,
      targetCheckIns,
      completionRate,
      totalCalories,
      totalDuration,
      avgDuration,
      dailyData,
    };
  }

  async getOverallSummary(year: number, month: number): Promise<any> {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const checkIns = await this.checkInRepository.find({
      where: {
        checkInDate: Between(start, end),
        completed: true,
      },
      relations: ['fitnessPlan'],
    });

    const fitnessPlans = await this.fitnessPlanRepository.find({ where: { isActive: true } });

    const totalCheckIns = checkIns.length;
    const totalCalories = checkIns.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0);
    const totalDuration = checkIns.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);

    const planSummaries = await Promise.all(
      fitnessPlans.map(async plan => {
        const planCheckIns = checkIns.filter(c => c.fitnessPlanId === plan.id);
        const planCalories = planCheckIns.reduce((sum, c) => sum + (c.caloriesBurned || 0), 0);
        const planDuration = planCheckIns.reduce((sum, c) => sum + (c.durationMinutes || 0), 0);
        const targetCheckIns = Math.min(plan.frequencyPerWeek * 4, 31);
        const completionRate = planCheckIns.length > 0 && targetCheckIns > 0
          ? Math.min(100, Math.round((planCheckIns.length / targetCheckIns) * 100))
          : 0;

        return {
          planId: plan.id,
          planName: plan.name,
          checkIns: planCheckIns.length,
          targetCheckIns,
          completionRate,
          calories: planCalories,
          duration: planDuration,
        };
      }),
    );

    return {
      year,
      month,
      totalCheckIns,
      totalCalories,
      totalDuration,
      activePlans: fitnessPlans.length,
      planSummaries,
    };
  }

  async getStreak(fitnessPlanId: number): Promise<any> {
    const checkIns = await this.checkInRepository.find({
      where: { fitnessPlanId, completed: true },
      order: { checkInDate: 'DESC' },
    });

    if (checkIns.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalCheckIns: 0 };
    }

    const dates = checkIns.map(c => c.checkInDate);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
      const diff = Math.abs((dates[i].getTime() - dates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 1) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        if (i === 0) {
          currentStreak = tempStreak;
        }
        tempStreak = 1;
      }
    }

    if (currentStreak === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const diff = Math.abs((today.getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24));
      if (diff <= 1) {
        currentStreak = tempStreak;
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, tempStreak),
      totalCheckIns: checkIns.length,
    };
  }
}
