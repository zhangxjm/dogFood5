import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './registration.entity';
import { CreateRegistrationDto, UpdateRegistrationDto } from './registration.dto';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  async findAll(): Promise<Registration[]> {
    return this.registrationRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByCourse(courseId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { courseId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({ where: { id } });
    if (!registration) {
      throw new NotFoundException('报名记录不存在');
    }
    return registration;
  }

  async create(createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    const registration = this.registrationRepository.create({
      ...createRegistrationDto,
      paymentStatus: 'paid',
    });
    return this.registrationRepository.save(registration);
  }

  async update(id: number, updateRegistrationDto: UpdateRegistrationDto): Promise<Registration> {
    await this.findOne(id);
    await this.registrationRepository.update(id, updateRegistrationDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.registrationRepository.delete(id);
  }
}
