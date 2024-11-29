import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { EgyptianCity } from '../enums/egyptian-cities.enum.ts';

@Schema()
export class OrderedProduct {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product: Types.ObjectId;

    @Prop()
    quantity:Number;
  

  
}

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: [OrderedProduct], required: true })
    products: OrderedProduct[];

    @Prop({ required: true })
    totalPrice: Number;

    @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;
   
    @Prop({
        required: true,
        enum: EgyptianCity,
        
      })
      city: EgyptianCity;

      @Prop({
        required: true,
     
        validate: {
          validator: (phone: string) => {
            const phoneNumber = parsePhoneNumberFromString(phone);
            return phoneNumber?.isValid() ?? false;
          },
          message: 'Invalid phone number. Please provide a valid phone number in international format.',
        },
      })
      phone: string;
      

}

export const OrderSchema = SchemaFactory.createForClass(Order);
