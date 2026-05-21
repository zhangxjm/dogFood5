import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  serviceTypeId: string;

  @IsString()
  customerId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  pickupAddress: string;

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  remark?: string;
}
