import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, BatchAttendanceDto } from './attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findBySchedule(scheduleId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { scheduleId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) {
      throw new NotFoundException('考勤记录不存在');
    }
    return attendance;
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  async createBatch(batchAttendanceDto: BatchAttendanceDto): Promise<Attendance[]> {
    const { scheduleId, attendances } = batchAttendanceDto;
    const records = attendances.map(item => ({
      scheduleId,
      registrationId: item.registrationId,
      childName: item.childName,
      status: item.status || 'absent',
      remark: item.remark,
    }));
    const attendanceRecords = this.attendanceRepository.create(records);
    return this.attendanceRepository.save(attendanceRecords);
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    await this.findOne(id);
    await this.attendanceRepository.update(id, updateAttendanceDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.attendanceRepository.delete(id);
  }
}
