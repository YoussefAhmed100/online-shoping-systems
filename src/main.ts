import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import * as mongoose from 'mongoose';
import helmet from 'helmet';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    
  }));
  app.use(helmet());
  app.enableCors(); 
  dotenv.config(); 

//  setup swagger
  setupSwagger(app);
  // mongoose.set('debug', true);
 

  await app.listen(process.env.PORT,'0.0.0.0');
}

  bootstrap();







