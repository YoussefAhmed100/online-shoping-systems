import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/schema/user.schema';
import { UserValidationService } from './validation/user-validation.service';

@Module({
imports:[
  MongooseModule.forFeature([{name:"User",schema:UserSchema}]),
 

],
  controllers: [UserController],
  providers: [UserService, UserValidationService]
})
export class UserModule {}
