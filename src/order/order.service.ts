
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import{Query } from 'express-serve-static-core'

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {}

    // Create a new order
    async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

  
    async getAllOrders(query: Query): Promise< Order[]> {
        const resPerPage=4  //add any number would you like
        const currentPage=Number(query.page)||1
        const skip=(currentPage-1)*resPerPage
    
        const keyword =query.keyword ?{
            title:{
                $regex:query.keyword,
                $options:'i'
            }
            
        }:{} 
        return await this.orderModel.find({...keyword}).limit(resPerPage).skip(skip)
    }

    // Get orders by user ID
    async getOrdersByUserId(userId: string): Promise<Order[]> {
        return this.orderModel.find({ user: userId }).populate('products.product user').exec();
    }

    // Update an order
    async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
        const order = await this.orderModel.findByIdAndUpdate(orderId, updateOrderDto, { new: true });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        return order;
    }

    // Delete an order
    async deleteOrder(orderId: string): Promise<Order> {
        const order = await this.orderModel.findByIdAndDelete(orderId);
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        return order;
    }
}
