import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FitnessPlanModule } from './fitness-plan/fitness-plan.module';
import { CheckInModule } from './check-in/check-in.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'fitness',
      password: process.env.DB_PASSWORD || 'fitness123',
      database: process.env.DB_DATABASE || 'fitness_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    FitnessPlanModule,
    CheckInModule,
    StatisticsModule,
  ],
})
export class AppModule {}
