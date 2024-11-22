// dto/update-order.dto.ts
import { IsEnum, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderedProductDto } from './ordered-product.dto';
import { EgyptianCity } from '../enums/egyptian-cities.enum.ts';
import { IsPhoneNumber } from '../validators/is-phone-number.decorator';


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
    @IsOptional()
    @IsPhoneNumber({ message: 'Phone number must be valid and in international format.' })
    phone: string;
  @IsOptional()
  @IsEnum(EgyptianCity, { message: 'City must be one of the predefined Egyptian cities' })
  city: EgyptianCity;
}
