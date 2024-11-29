import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
 
      const newOrder = await this.orderModel.create(createOrderDto);
      return await newOrder.save();

  }

  // Get all orders with pagination and optional keyword search
  async getAllOrders(query: Query): Promise<Order[]> {
    const resPerPage = 4;
    const currentPage = Number(query.page) || 1;
    const skip = (currentPage - 1) * resPerPage;

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

   
      return await this.orderModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip)
        .exec();
  
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (!isValidObjectId(userId)) {
      throw new BadRequestException(`Invalid Order ID: ${userId}`);
    }

      return await this.orderModel
        .find({ user: userId })
        .populate('products.product user')
        .exec();
  }

  // Update an order
  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    if (!isValidObjectId(orderId)) {
      throw new BadRequestException(`Invalid Order ID: ${orderId}`);
    }
   
      const order = await this.orderModel.findByIdAndUpdate(orderId, updateOrderDto, { new: true }).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
  
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<Order> {
    if (!isValidObjectId(orderId)) {
      throw new BadRequestException(`Invalid Order ID: ${orderId}`);
    }
  
      const order = await this.orderModel.findByIdAndDelete(orderId).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
  
  }
}
