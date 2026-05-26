import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './modules/course/course.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { AttendanceModule } from './modules/attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'craft',
      password: 'craft123',
      database: 'craft_course',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    CourseModule,
    RegistrationModule,
    ScheduleModule,
    AttendanceModule,
  ],
})
export class AppModule {}
