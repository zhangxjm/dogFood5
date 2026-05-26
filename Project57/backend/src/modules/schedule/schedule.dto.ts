export class CreateScheduleDto {
  courseId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  teacher?: string;
  maxStudents?: number;
}

export class UpdateScheduleDto {
  scheduleDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  teacher?: string;
  maxStudents?: number;
}
