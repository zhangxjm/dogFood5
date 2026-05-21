import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { AcceptOrderDto } from './dto/accept-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { EventsGateway } from '../events/events.gateway';
import { validateAndCreateObjectId } from '../utils/validate-objectid';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private eventsGateway: EventsGateway,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      serviceTypeId: validateAndCreateObjectId(createOrderDto.serviceTypeId, 'serviceTypeId'),
      customerId: validateAndCreateObjectId(createOrderDto.customerId, 'customerId'),
    });
    const savedOrder = await createdOrder.save();
    await savedOrder.populate('serviceTypeId', 'name basePrice');
    await savedOrder.populate('customerId', 'name phone');
    this.eventsGateway.emitOrderCreated(savedOrder);
    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find()
      .populate('serviceTypeId', 'name basePrice')
      .populate('customerId', 'name phone')
      .populate('runnerId', 'name phone rating')
      .exec();
  }

  async findPending(): Promise<Order[]> {
    return this.orderModel.find({ status: OrderStatus.PENDING })
      .populate('serviceTypeId', 'name basePrice')
      .populate('customerId', 'name phone')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id)
      .populate('serviceTypeId', 'name basePrice')
      .populate('customerId', 'name phone')
      .populate('runnerId', 'name phone rating')
      .exec();
  }

  async findByCustomer(customerId: string): Promise<Order[]> {
    return this.orderModel.find({ customerId: validateAndCreateObjectId(customerId, 'customerId') })
      .populate('serviceTypeId', 'name basePrice')
      .populate('runnerId', 'name phone rating')
      .exec();
  }

  async findByRunner(runnerId: string): Promise<Order[]> {
    return this.orderModel.find({ runnerId: validateAndCreateObjectId(runnerId, 'runnerId') })
      .populate('serviceTypeId', 'name basePrice')
      .populate('customerId', 'name phone')
      .exec();
  }

  async acceptOrder(id: string, acceptOrderDto: AcceptOrderDto): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not pending');
    }
    if (order.runnerId) {
      throw new BadRequestException('Order already accepted by another runner');
    }

    order.runnerId = validateAndCreateObjectId(acceptOrderDto.runnerId, 'runnerId');
    order.status = OrderStatus.ACCEPTED;
    const savedOrder = await order.save();
    await savedOrder.populate('serviceTypeId', 'name basePrice');
    await savedOrder.populate('customerId', 'name phone');
    await savedOrder.populate('runnerId', 'name phone rating');
    this.eventsGateway.emitOrderAccepted(savedOrder);
    return savedOrder;
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const userId = validateAndCreateObjectId(updateOrderStatusDto.userId, 'userId');
    const isCustomer = order.customerId.equals(userId);
    const isRunner = order.runnerId && order.runnerId.equals(userId);

    if (!isCustomer && !isRunner) {
      throw new BadRequestException('You are not authorized to update this order');
    }

    const validTransitions = this.getValidTransitions(order.status, isCustomer, isRunner);
    if (!validTransitions.includes(updateOrderStatusDto.status)) {
      throw new BadRequestException('Invalid status transition');
    }

    order.status = updateOrderStatusDto.status;
    const savedOrder = await order.save();
    await savedOrder.populate('serviceTypeId', 'name basePrice');
    await savedOrder.populate('customerId', 'name phone');
    await savedOrder.populate('runnerId', 'name phone rating');
    this.eventsGateway.emitOrderStatusUpdated(savedOrder);
    return savedOrder;
  }

  private getValidTransitions(currentStatus: OrderStatus, isCustomer: boolean, isRunner: boolean): OrderStatus[] {
    switch (currentStatus) {
      case OrderStatus.PENDING:
        return isCustomer ? [OrderStatus.CANCELLED] : [];
      case OrderStatus.ACCEPTED:
        return isRunner ? [OrderStatus.PICKED_UP] : [OrderStatus.CANCELLED];
      case OrderStatus.PICKED_UP:
        return isRunner ? [OrderStatus.DELIVERED] : [];
      case OrderStatus.DELIVERED:
        return isCustomer ? [OrderStatus.COMPLETED] : [];
      default:
        return [];
    }
  }
}
