import {  IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

import { Type } from "class-transformer";
class ProductImageDto {
    @IsString()
    @IsNotEmpty()
  
    url: string;
  
    @IsString()
  
    @IsNotEmpty()
    publicId: string;
  }

export class CreateProductDto{
    @IsNotEmpty()
    @IsString()
    readonly title:string
   
    @IsString()
    @IsNotEmpty()
    readonly  description:string
    @IsNotEmpty()

    // @IsNumber()
    @IsOptional()
    // @Min(0, { message: 'quantity must be a positive number' })
    @IsNotEmpty({ message: 'quantity must not be empty' })
    quantity:number
    @IsNotEmpty()
    // @IsNumber()
    // @Min(0, { message: 'price must be a positive number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    readonly price:number
    @IsOptional()
    // @IsNumber()
    // @Min(0, { message: 'price must be a positive number' })
    @IsNotEmpty({ message: 'price must not be empty' })
    readonly priceAfterDiscound:number


    // @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProductImageDto)
    images: ProductImageDto[];
    @IsNotEmpty()
    @IsMongoId()
    category: string; // MongoDB ObjectId of the Category
  
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    rate?: number; // Optional rating field, defaults to 0 if not provided
  
    @IsNumber()
    @Min(0)
    @IsOptional()
    numberOfSales?: number; 
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

