import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger';
import { Handler } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    
  }));
  app.enableCors(); 
  dotenv.config(); 

//  setup swagger
  setupSwagger(app);

  await app.listen(process.env.PORT,'0.0.0.0');
}

if (require.main === module) {
  bootstrap();

}

// لتوافق Vercel، استخدم الوظائف التالية
export const handler: Handler = async (event, context) => {
  const app = await NestFactory.create(AppModule);
  return app.listen(3000).then(() => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from NestJS on Vercel" })
    };
  });
};


//.X3kz4PQbj.A!DL
