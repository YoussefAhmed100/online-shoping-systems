import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './schema/category.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports:[
    AuthModule,
    MongooseModule.forFeature([{name:'Category',schema:CategorySchema}])
  ],
  
  providers: [CategoryService,CloudinaryService],
  controllers: [CategoryController],
 
  exports: [CategoryService],
})
export class CategoryModule {}
