import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CompletedExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  completedSets: number;

  @IsNumber()
  @IsNotEmpty()
  completedReps: number;

  @IsOptional()
  duration?: number;
}

export class CreateCheckInDto {
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsString()
  @IsNotEmpty()
  checkInDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedExerciseDto)
  completedExercises: CompletedExerciseDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  caloriesBurned?: number;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;
}
