import { HttpException, HttpStatus, Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SinupDto } from './dto/sinup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Signup method
  async sinup(sinupDto: SinupDto): Promise<{ user:User; token: string }> {
 
      const { name, email, password, role } = sinupDto;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new BadRequestException('Email is already in use');
        
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const  user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      
        
      });


    // // Exclude password
    // const user = await this.userModel
    // .findById(createdUser._id)
    // .select('-password')
    // .lean();

      // Generate JWT token
      const token = this.jwtService.sign({ id:user._id });
      return {user,token};
   
  }

  // Login method
  async login(loginDto: LoginDto): Promise<{user: User,token: string }> {
   
      const { email, password } = loginDto;
      
      // Find user by email
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('user not fond');
      }

      // Check if password is valid
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id });
      return {user, token };
  
  }
}
