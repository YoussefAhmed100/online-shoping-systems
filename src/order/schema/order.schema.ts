import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Product } from 'src/product/schema/product.schema';
import { OrderStatus } from '../enums/order-status.enum';

@Schema()
export class OrderedProduct {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product: Product;

    @Prop({ required: true })
    quantity: number;

  
}

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User;

    @Prop({ type: [OrderedProduct], required: true })
    products: OrderedProduct[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
