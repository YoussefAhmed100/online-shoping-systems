import { IsEmail,  IsEnum,  IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";
import { Exclude } from "class-transformer";

export class SinupDto{
    @IsNotEmpty()
    @IsString()
    readonly name:string
   @IsEmail({},{message:"Please enter the valid email"})
    @IsNotEmpty()
    
    readonly email:string
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Exclude()
    readonly password:string
    
    @IsOptional()
    @IsEnum(Role)
    readonly role:Role[]
   
}

