import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([{
      name: Order.name,
      schema:OrderSchema,
    }])
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
