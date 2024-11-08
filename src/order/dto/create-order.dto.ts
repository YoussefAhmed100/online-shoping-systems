// dto/create-order.dto.ts
import { IsNotEmpty, IsArray, ValidateNested, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderedProductDto } from './ordered-product.dto';


export class CreateOrderDto {
    @IsNotEmpty()
    user: string;  // Expecting the user ID here

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderedProductDto)
    products: OrderedProductDto[];

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}
