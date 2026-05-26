export class CreateCourseDto {
  name: string;
  description: string;
  price: number;
  capacity: number;
  imageUrl?: string;
}

export class UpdateCourseDto {
  name?: string;
  description?: string;
  price?: number;
  capacity?: number;
  imageUrl?: string;
  isActive?: boolean;
}
