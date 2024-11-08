import { IsOptional, IsString, IsArray, IsNumber, minLength, IsEnum, IsNotEmpty, Min, IsEmpty } from 'class-validator';
import { User } from 'src/auth/schema/user.schema';
import { Category } from 'src/category/schema/category.schema';


export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
  @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    readonly price:Number
 
  


  @IsOptional()
  @IsArray()
  images?: { url: string; publicId: string }[]; // Define image structure if needed;
 
  @IsEmpty({message:"you cannot pass category id"})
  readonly type: Category

}