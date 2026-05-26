import { IsInt, IsOptional, IsBoolean, IsString, IsDateString } from 'class-validator';

export class CreateCheckInDto {
  @IsInt()
  fitnessPlanId: number;

  @IsDateString()
  checkInDate: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  caloriesBurned?: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateCheckInDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  caloriesBurned?: number;

  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
