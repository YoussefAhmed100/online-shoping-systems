// user-validation.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class UserValidationService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async validateEmailAvailability(email: string, currentUserId: string): Promise<void> {
        const existingUser = await this.userModel.findOne({ email }).exec();
        if (existingUser && existingUser._id.toString() !== currentUserId) {
            throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
        }
    }
}
