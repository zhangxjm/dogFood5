import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FitnessPlanModule } from './modules/fitness-plan/fitness-plan.module';
import { CheckInModule } from './modules/check-in/check-in.module';
import { SummaryModule } from './modules/summary/summary.module';
import { FitnessPlan } from './entities/fitness-plan.entity';
import { CheckIn } from './entities/check-in.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'fitness_db',
      entities: [FitnessPlan, CheckIn],
      synchronize: true,
      logging: false,
    }),
    FitnessPlanModule,
    CheckInModule,
    SummaryModule,
  ],
})
export class AppModule {}
