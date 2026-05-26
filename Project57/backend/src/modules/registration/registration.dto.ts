export class CreateRegistrationDto {
  courseId: number;
  parentName: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  amount: number;
  remark?: string;
}

export class UpdateRegistrationDto {
  paymentStatus?: string;
  remark?: string;
}
