import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, BatchAttendanceDto } from './attendance.dto';
import { Attendance } from './attendance.entity';

@Controller('attendances')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  findAll(@Query('scheduleId') scheduleId?: number): Promise<Attendance[]> {
    if (scheduleId) {
      return this.attendanceService.findBySchedule(scheduleId);
    }
    return this.attendanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Attendance> {
    return this.attendanceService.findOne(id);
  }

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('batch')
  createBatch(@Body() batchAttendanceDto: BatchAttendanceDto): Promise<Attendance[]> {
    return this.attendanceService.createBatch(batchAttendanceDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.attendanceService.remove(id);
  }
}
