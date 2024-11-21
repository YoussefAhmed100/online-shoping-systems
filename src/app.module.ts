import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env'

    }),
    MongooseModule.forRoot(process.env.MONGODB_URI,{
    
      tls: true, // Ensure TLS is enabled
      tlsInsecure: false, // Disable insecure connections
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
    }
    ),
    ProductModule, AuthModule, CloudinaryModule, OrderModule, UserModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService,CloudinaryProvider],
})
export class AppModule {}
