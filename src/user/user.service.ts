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
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new InternalServerErrorException('An error occurred while retrieving users');
    }
  }

  // Get a user by ID
  async findOne(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while retrieving the user');
    }
  }

  // Update a user by ID
  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
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
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while updating the user');
    }
  }

  // Delete a user by ID
  async delete(userId: string): Promise<void> {
    try {
      const result = await this.userModel.deleteOne({ _id: userId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('An error occurred while deleting the user');
    }
  }

  // Delete all users
  async deleteAll(): Promise<void> {
    try {
      await this.userModel.deleteMany().exec();
    } catch (error) {
      console.error('Error deleting all users:', error);
      throw new InternalServerErrorException('An error occurred while deleting all users');
    }
  }
}
