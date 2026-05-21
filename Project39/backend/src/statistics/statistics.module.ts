import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { CheckIn } from '../check-in/entities/check-in.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
