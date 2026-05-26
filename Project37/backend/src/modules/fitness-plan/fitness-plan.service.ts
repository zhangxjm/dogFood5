import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FitnessPlan } from '../../entities/fitness-plan.entity';
import { CreateFitnessPlanDto, UpdateFitnessPlanDto } from './dto/fitness-plan.dto';

@Injectable()
export class FitnessPlanService {
  constructor(
    @InjectRepository(FitnessPlan)
    private fitnessPlanRepository: Repository<FitnessPlan>,
  ) {}

  async findAll(): Promise<FitnessPlan[]> {
    return this.fitnessPlanRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findActive(): Promise<FitnessPlan[]> {
    return this.fitnessPlanRepository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<FitnessPlan> {
    const plan = await this.fitnessPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Fitness plan with ID ${id} not found`);
    }
    return plan;
  }

  async create(createDto: CreateFitnessPlanDto): Promise<FitnessPlan> {
    const plan = this.fitnessPlanRepository.create(createDto);
    return this.fitnessPlanRepository.save(plan);
  }

  async update(id: number, updateDto: UpdateFitnessPlanDto): Promise<FitnessPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.fitnessPlanRepository.save(plan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.fitnessPlanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fitness plan with ID ${id} not found`);
    }
  }

  async toggleActive(id: number): Promise<FitnessPlan> {
    const plan = await this.findOne(id);
    plan.isActive = !plan.isActive;
    return this.fitnessPlanRepository.save(plan);
  }
}
