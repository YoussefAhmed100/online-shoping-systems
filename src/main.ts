import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    
  }));
  app.enableCors(); 
  app.use(compression());
  await app.listen(process.env.PORT||3000);
}
bootstrap();


//.X3kz4PQbj.A!DL
