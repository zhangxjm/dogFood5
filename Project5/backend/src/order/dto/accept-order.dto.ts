import { IsString } from 'class-validator';

export class AcceptOrderDto {
  @IsString()
  runnerId: string;
}
