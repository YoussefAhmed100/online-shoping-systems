import {  IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Number } from 'mongoose';


 export class OrderedProductDto {
    @IsNotEmpty()
    product: string;  // Expecting the product ID here
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: Number

   
}
