import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateServiceTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePrice: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
