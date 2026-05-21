import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowerService } from './flower.service';
import { FlowerController } from './flower.controller';
import { Flower } from './flower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flower])],
  controllers: [FlowerController],
  providers: [FlowerService],
  exports: [FlowerService],
})
export class FlowerModule {}
