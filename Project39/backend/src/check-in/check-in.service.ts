import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CheckIn } from './entities/check-in.entity';
import { CreateCheckInDto } from './dto/create-check-in.dto';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckIn)
    private readonly checkInRepository: Repository<CheckIn>,
  ) {}

  async create(createCheckInDto: CreateCheckInDto): Promise<CheckIn> {
    const checkIn = this.checkInRepository.create(createCheckInDto);
    return await this.checkInRepository.save(checkIn);
  }

  async findAll(): Promise<CheckIn[]> {
    return await this.checkInRepository.find({
      relations: ['plan'],
      order: { checkInDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CheckIn> {
    const checkIn = await this.checkInRepository.findOne({
      where: { id },
      relations: ['plan'],
    });
    if (!checkIn) {
      throw new NotFoundException(`打卡记录 #${id} 不存在`);
    }
    return checkIn;
  }

  async findByDate(date: string): Promise<CheckIn[]> {
    return await this.checkInRepository.find({
      where: { checkInDate: date },
      relations: ['plan'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<CheckIn[]> {
    return await this.checkInRepository.find({
      where: { checkInDate: Between(startDate, endDate) },
      relations: ['plan'],
      order: { checkInDate: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.checkInRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`打卡记录 #${id} 不存在`);
    }
  }
}
