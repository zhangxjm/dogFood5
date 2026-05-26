export class CreateAttendanceDto {
  scheduleId: number;
  registrationId: number;
  childName: string;
  status?: string;
  remark?: string;
}

export class UpdateAttendanceDto {
  status?: string;
  remark?: string;
}

export class BatchAttendanceDto {
  scheduleId: number;
  attendances: Array<{
    registrationId: number;
    childName: string;
    status?: string;
    remark?: string;
  }>;
}
