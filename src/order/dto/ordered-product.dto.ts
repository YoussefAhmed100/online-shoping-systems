import {  IsNotEmpty, IsNumber, IsPositive } from 'class-validator';


 export class OrderedProductDto {
    @IsNotEmpty()
    product: string;  // Expecting the product ID here

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
}
