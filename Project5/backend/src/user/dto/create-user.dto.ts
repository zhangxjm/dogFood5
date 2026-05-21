import { IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(['customer', 'runner'])
  role?: string;
}
