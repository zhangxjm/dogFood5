import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { CheckIn } from './entities/check-in.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CheckIn])],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [TypeOrmModule],
})
export class CheckInModule {}
