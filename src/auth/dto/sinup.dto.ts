import { IsEmail,  IsEnum,  IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../enums/role.enum";

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
 
    readonly password:string
    
    @IsOptional()
    @IsEnum(Role)
    readonly role:Role[]
   
}

