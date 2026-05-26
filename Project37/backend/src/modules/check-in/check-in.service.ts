import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckIn } from '../../entities/check-in.entity';
import { FitnessPlan } from '../../entities/fitness-plan.entity';
import { CreateCheckInDto, UpdateCheckInDto } from './dto/check-in.dto';
import { startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private checkInRepository: Repository<CheckIn>,
    @InjectRepository(FitnessPlan)
    private fitnessPlanRepository: Repository<FitnessPlan>,
  ) {}

  async findAll(fitnessPlanId?: number, date?: string): Promise<CheckIn[]> {
    const where: any = {};
    if (fitnessPlanId) where.fitnessPlanId = fitnessPlanId;
    if (date) where.checkInDate = date;
    return this.checkInRepository.find({ where, order: { checkInDate: 'DESC' } });
  }

  async findByDateRange(fitnessPlanId: number, startDate: string, endDate: string): Promise<CheckIn[]> {
    return this.checkInRepository.find({
      where: {
        fitnessPlanId,
        checkInDate: Between(new Date(startDate), new Date(endDate)),
      },
      order: { checkInDate: 'DESC' },
    });
  }

  async findByMonth(fitnessPlanId: number, year: number, month: number): Promise<CheckIn[]> {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));
    return this.checkInRepository.find({
      where: {
        fitnessPlanId,
        checkInDate: Between(start, end),
      },
      order: { checkInDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<CheckIn> {
    const checkIn = await this.checkInRepository.findOne({ where: { id } });
    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
    return checkIn;
  }

  async create(createDto: CreateCheckInDto): Promise<CheckIn> {
    const fitnessPlan = await this.fitnessPlanRepository.findOne({
      where: { id: createDto.fitnessPlanId },
    });
    if (!fitnessPlan) {
      throw new BadRequestException(`Fitness plan with ID ${createDto.fitnessPlanId} not found`);
    }

    const existing = await this.checkInRepository.findOne({
      where: {
        fitnessPlanId: createDto.fitnessPlanId,
        checkInDate: new Date(createDto.checkInDate),
      },
    });

    if (existing) {
      throw new BadRequestException('Check-in for this date already exists');
    }

    const checkIn = this.checkInRepository.create({
      ...createDto,
      checkInDate: new Date(createDto.checkInDate),
    });
    return this.checkInRepository.save(checkIn);
  }

  async update(id: number, updateDto: UpdateCheckInDto): Promise<CheckIn> {
    const checkIn = await this.findOne(id);
    Object.assign(checkIn, updateDto);
    return this.checkInRepository.save(checkIn);
  }

  async remove(id: number): Promise<void> {
    const result = await this.checkInRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }
  }

  async getTodayCheckIn(fitnessPlanId: number): Promise<CheckIn | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    return this.checkInRepository.findOne({
      where: {
        fitnessPlanId,
        checkInDate: new Date(today),
      },
    });
  }
}
