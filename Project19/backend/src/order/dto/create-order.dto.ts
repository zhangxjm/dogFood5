import { IsString, IsEnum, IsUUID, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { OrderType } from '../order.entity';

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  customerPhone: string;

  @IsEnum(OrderType)
  orderType: OrderType;

  @IsDateString()
  reservationTime: string;

  @IsUUID()
  flowerId: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsNumber()
  totalPrice: number;

  @IsString()
  @IsOptional()
  remark?: string;
}
