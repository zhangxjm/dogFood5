import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      reservationTime: new Date(createOrderDto.reservationTime),
    });
    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['flower', 'address'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPhone(phone: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerPhone: phone },
      relations: ['flower', 'address'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['flower', 'address'],
    });
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (updateOrderDto.reservationTime) {
      Object.assign(order, {
        ...updateOrderDto,
        reservationTime: new Date(updateOrderDto.reservationTime),
      });
    } else {
      Object.assign(order, updateOrderDto);
    }
    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('订单不存在');
    }
  }
}
