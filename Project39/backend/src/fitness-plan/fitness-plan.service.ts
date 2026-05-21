import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitnessPlan } from './entities/fitness-plan.entity';
import { CreateFitnessPlanDto } from './dto/create-fitness-plan.dto';
import { UpdateFitnessPlanDto } from './dto/update-fitness-plan.dto';

@Injectable()
export class FitnessPlanService {
  constructor(
    @InjectRepository(FitnessPlan)
    private readonly fitnessPlanRepository: Repository<FitnessPlan>,
  ) {}

  async create(createFitnessPlanDto: CreateFitnessPlanDto): Promise<FitnessPlan> {
    const plan = this.fitnessPlanRepository.create(createFitnessPlanDto);
    return await this.fitnessPlanRepository.save(plan);
  }

  async findAll(): Promise<FitnessPlan[]> {
    return await this.fitnessPlanRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<FitnessPlan> {
    const plan = await this.fitnessPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`健身方案 #${id} 不存在`);
    }
    return plan;
  }

  async update(id: number, updateFitnessPlanDto: UpdateFitnessPlanDto): Promise<FitnessPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateFitnessPlanDto);
    return await this.fitnessPlanRepository.save(plan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.fitnessPlanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`健身方案 #${id} 不存在`);
    }
  }
}
