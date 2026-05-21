import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Flower } from '../flower/flower.entity';
import { Address } from '../address/address.entity';

export enum OrderType {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.PICKUP,
  })
  orderType: OrderType;

  @Column({ type: 'timestamp' })
  reservationTime: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('uuid')
  flowerId: string;

  @ManyToOne(() => Flower)
  @JoinColumn({ name: 'flowerId' })
  flower: Flower;

  @Column('uuid', { nullable: true })
  addressId: string;

  @ManyToOne(() => Address, { nullable: true })
  @JoinColumn({ name: 'addressId' })
  address: Address;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true })
  remark: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
