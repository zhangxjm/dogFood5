import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessPlan } from '../../entities/fitness-plan.entity';
import { FitnessPlanController } from './fitness-plan.controller';
import { FitnessPlanService } from './fitness-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessPlan])],
  controllers: [FitnessPlanController],
  providers: [FitnessPlanService],
  exports: [FitnessPlanService],
})
export class FitnessPlanModule {}
