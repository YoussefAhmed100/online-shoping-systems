import { HttpException, HttpStatus, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidationService } from './validation/user-validation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly userValidationService: UserValidationService,
  ) {}

  // Get all users
  async findAll(): Promise<User[]> {
      return await this.userModel.find().exec();
   
  }

  // Get a user by ID
  async findOne(userId: string): Promise<User> {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
   
  }

  // Update a user by ID
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Validate email availability if updating the email
      if (updateUserDto.email) {
        await this.userValidationService.validateEmailAvailability(updateUserDto.email, userId);
      }

      // Hash the password if it is being updated
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Update user details
      await user.updateOne(updateUserDto);
      return this.findOne(userId); // Fetch updated user data
   
  }

  // Delete a user by ID
  async delete(userId: string): Promise<string> {
      const result = await this.userModel.deleteOne({ _id: userId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('User not found');
      }
      return "user deleted successfully"
   
  }

  // Delete all users
  async deleteAll(): Promise<string> {
      await this.userModel.deleteMany().exec();
      return "all users deleted successfully"
   
  }
}
