import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from './schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({ order: { scheduleDate: 'ASC', startTime: 'ASC' } });
  }

  async findByCourse(courseId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { courseId },
      order: { scheduleDate: 'ASC', startTime: 'ASC' },
    });
  }

  async findByDate(date: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { scheduleDate: date },
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('排班记录不存在');
    }
    return schedule;
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(createScheduleDto);
    return this.scheduleRepository.save(schedule);
  }

  async createBatch(createScheduleDtos: CreateScheduleDto[]): Promise<Schedule[]> {
    const schedules = this.scheduleRepository.create(createScheduleDtos);
    return this.scheduleRepository.save(schedules);
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    await this.findOne(id);
    await this.scheduleRepository.update(id, updateScheduleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.scheduleRepository.delete(id);
  }
}
