import { Module } from '@nestjs/common';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schema/product.schema';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CategoryModule } from 'src/category/category.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([{name:'Product',schema:productSchema}]),
    CategoryModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService,CloudinaryProvider,CloudinaryService,
  {  
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ]

})
export class ProductModule {}

