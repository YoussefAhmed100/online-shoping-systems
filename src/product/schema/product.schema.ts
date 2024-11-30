import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
class ProductImage {
  @Prop({  })
  url: string;

  @Prop({  })
  publicId: string;
}
// **************************************
@Schema({
    timestamps:true
})
export class Product{
    @Prop({ required: true })
    title: string;
  
    @Prop({ required: true })
    description: string;
    
    @Prop({})
    quantity:string

  
    @Prop()
    price: string;
    @Prop()
    priceAfterDiscound:string
  
    @Prop( {type: [ProductImage]})
    images: ProductImage[];
    @Prop({ type:mongoose.Schema.Types.ObjectId, ref: 'Category' })
    category:mongoose.Schema.Types.ObjectId;

  @Prop({ default: 1, min: 1, max: 5 })
  rate: number; // Rating between 0 and 5

  @Prop({ default: 0 })
  numberOfSales: number; 
 
   
}
export const productSchema= SchemaFactory.createForClass(Product)
    
