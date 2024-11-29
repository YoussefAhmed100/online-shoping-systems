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
  @Min(0, { message: 'quantity must be a positive number' })
  @IsNotEmpty({ message: 'quantity must not be empty' })
  quantity:number
  @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Price must be a positive number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    readonly price:number
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'price must be a positive number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    readonly priceAfterDiscound:number
 
  


  @IsOptional()
  @IsArray()
  images?: { url: string; publicId: string }[]; // Define image structure if needed;
 
  @IsEmpty({message:"you cannot pass category id"})
  readonly type: Category;

      // Custom validation logic
      validate() {
        if (
          this.priceAfterDiscound !== undefined &&
          this.priceAfterDiscound >= this.price
        ) {
          throw new Error(
            'price After Discound must be lower than price'
          );
        }
      }

}