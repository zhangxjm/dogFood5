import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessPlanService } from './fitness-plan.service';
import { FitnessPlanController } from './fitness-plan.controller';
import { FitnessPlan } from './entities/fitness-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FitnessPlan])],
  controllers: [FitnessPlanController],
  providers: [FitnessPlanService],
  exports: [TypeOrmModule],
})
export class FitnessPlanModule {}
