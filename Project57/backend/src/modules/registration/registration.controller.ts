import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto, UpdateRegistrationDto } from './registration.dto';
import { Registration } from './registration.entity';

@Controller('registrations')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Get()
  findAll(@Query('courseId') courseId?: number): Promise<Registration[]> {
    if (courseId) {
      return this.registrationService.findByCourse(courseId);
    }
    return this.registrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Registration> {
    return this.registrationService.findOne(id);
  }

  @Post()
  create(@Body() createRegistrationDto: CreateRegistrationDto): Promise<Registration> {
    return this.registrationService.create(createRegistrationDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRegistrationDto: UpdateRegistrationDto): Promise<Registration> {
    return this.registrationService.update(id, updateRegistrationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.registrationService.remove(id);
  }
}
