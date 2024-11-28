import { Controller, Get,Query, Post, UseGuards, Body, Param, Put, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schema/order.schema';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import{Query as ExpressQuery} from 'express-serve-static-core'

@Controller('orders')
// @UseGuards(AuthGuard('jwt'), RolesGuard) 
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // Only ADMIN and MANAGER
    @Post()
    // @Roles(Role.Admin, Role.Moderator)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.orderService.createOrder(createOrderDto);
    }

    // Only ADMIN and USER roles can get an order by ID
    @Get('allOrder')
    async getAll(@Query() query: ExpressQuery): Promise< Order[]> {
        return this.orderService.getAllOrders(query);
    }

    // Get orders by user ID, accessible to any authenticated user
    @Get('user/:userId')
    async getOrdersByUserId(@Param('userId') userId: string): Promise<Order[]> {
        return this.orderService.getOrdersByUserId(userId);
    }

    // Only ADMIN can update an order
    @Put(':id')
    @Roles(Role.Admin)
    async updateOrder(
        @Param('id') orderId: string,
        @Body() updateOrderDto: UpdateOrderDto,
    ): Promise<Order> {
        return this.orderService.updateOrder(orderId, updateOrderDto);
    }

    // Only ADMIN can delete an order
    @Delete(':id')
    // @Roles(Role.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteOrder(@Param('id') orderId: string): Promise<void> {
        await this.orderService.deleteOrder(orderId);
    }
}
