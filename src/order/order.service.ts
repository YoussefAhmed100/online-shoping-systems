import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Query } from 'express-serve-static-core';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const newOrder = new this.orderModel(createOrderDto);
      return await newOrder.save();
    } catch (error) {
      console.error('Error creating order:', error);
      throw new InternalServerErrorException('An error occurred while creating the order');
    }
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

    try {
      return await this.orderModel
        .find({ ...keyword })
        .limit(resPerPage)
        .skip(skip)
        .exec();
    } catch (error) {
      console.error('Error retrieving orders:', error);
      throw new InternalServerErrorException('An error occurred while retrieving orders');
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      return await this.orderModel
        .find({ user: userId })
        .populate('products.product user')
        .exec();
    } catch (error) {
      console.error('Error retrieving orders by user ID:', error);
      throw new InternalServerErrorException('An error occurred while retrieving orders for the user');
    }
  }

  // Update an order
  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      const order = await this.orderModel.findByIdAndUpdate(orderId, updateOrderDto, { new: true }).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      console.error('Error updating order:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while updating the order');
    }
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<Order> {
    try {
      const order = await this.orderModel.findByIdAndDelete(orderId).exec();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      return order;
    } catch (error) {
      console.error('Error deleting order:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the order');
    }
  }
}
