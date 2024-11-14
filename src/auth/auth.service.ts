import { HttpException, HttpStatus, Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
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
  async sinup(sinupDto: SinupDto): Promise<{ token: string }> {
    try {
      const { name, email, password, role } = sinupDto;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      console.error('Error in sinup:', error);
      throw new InternalServerErrorException('An error occurred during signup');
    }
  }

  // Login method
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginDto;
      
      // Find user by email
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Check if password is valid
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id });
      return { token };
    } catch (error) {
      console.error('Error in login:', error);
      throw new InternalServerErrorException('An error occurred during login');
    }
  }
}
