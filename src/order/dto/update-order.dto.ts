// dto/update-order.dto.ts
import { IsEnum, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderedProductDto } from './ordered-product.dto';


export class UpdateOrderDto {
    @IsOptional()
    user?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderedProductDto)
    products?: OrderedProductDto[];

    @IsOptional()
    @IsNumber()
    totalPrice?: number;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}
