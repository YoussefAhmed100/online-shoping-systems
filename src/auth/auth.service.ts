import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
        private jwtService:JwtService
    ){}
    async sinup(sinupDto:SinupDto):Promise<{token:string}>{
       const {name, email,password,role}=sinupDto
       const existingUser = await this.userModel.findOne({email:sinupDto.email})
       if(existingUser){
           throw new HttpException('please enter the valid email',HttpStatus.UNPROCESSABLE_ENTITY)
       }
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await this.userModel.create({name,email,password:hashedPassword,role});

       const token=this.jwtService.sign({id:user._id})

     return {token}

    }
    async login(loginDto:LoginDto):Promise<{token:string}>{
        const {email,password}=loginDto
        const user = await this.userModel.findOne({email})
        if(!user){
            throw new UnauthorizedException('invalid email or password')
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            throw new UnauthorizedException('invalid email or password')
            }
            const token=this.jwtService.sign({id:user._id})
            return {token}
        }
    }

    

