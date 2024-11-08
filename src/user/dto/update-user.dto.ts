import { IsEmail,  IsEnum,  IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "src/auth/enums/role.enum";


export class UpdateUserDto{
   
    @IsString()
    @IsOptional()
   name:string
    
    @IsOptional()
   @IsEmail({},{message:"Please enter the valid email"})
    @IsNotEmpty()
     email:string
    @IsString()
    @MinLength(6)
    @IsOptional()
    password:string
    
    @IsOptional()
    @IsEnum(Role)
    readonly role:Role[]
   
}

