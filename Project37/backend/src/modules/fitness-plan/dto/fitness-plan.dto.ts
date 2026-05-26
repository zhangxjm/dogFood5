import { IsString, IsInt, IsOptional, IsArray, IsBoolean, Min, Max } from 'class-validator';

export class CreateFitnessPlanDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  duration?: number;

  @IsOptional()
  @IsArray()
  exercises?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  frequencyPerWeek?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFitnessPlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  duration?: number;

  @IsOptional()
  @IsArray()
  exercises?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  frequencyPerWeek?: number;

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
