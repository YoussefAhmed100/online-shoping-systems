import { IsArray, IsEmpty, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

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
   
    readonly price:string


    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductImageDto)
    images?: ProductImageDto[];
    @IsOptional()
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




   
}

