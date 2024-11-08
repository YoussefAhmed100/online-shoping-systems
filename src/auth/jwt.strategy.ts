import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import {   ExtractJwt,Strategy } from "passport-jwt";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";

@Injectable()
 export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name)
    private readonly userModel: Model<User>) 
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'yourSecretKey',

        })
    }
    async validate(payload){
        const {id}=payload
        const user = await this.userModel.findById(id).select("-password");
        if(!user){
            return new UnauthorizedException("please login frist")
        }
        return user;


    }

 }