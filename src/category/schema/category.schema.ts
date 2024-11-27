import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoryType } from '../enums/category-type.enum';

@Schema()
export class Category extends Document {
  @Prop({ required: true,unique:true })
  title: string;

  @Prop({ required: true })
  type: CategoryType;

  @Prop({
    type: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    required: false,
  })
  image: { url: string; publicId: string };
}

export const CategorySchema = SchemaFactory.createForClass(Category);
