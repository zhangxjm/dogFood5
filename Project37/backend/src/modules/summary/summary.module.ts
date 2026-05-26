import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckIn } from '../../entities/check-in.entity';
import { FitnessPlan } from '../../entities/fitness-plan.entity';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn, FitnessPlan])],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
