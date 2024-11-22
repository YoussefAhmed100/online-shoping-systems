import { IsNotEmpty, IsArray, ValidateNested, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderedProductDto } from './ordered-product.dto';
import { IsPhoneNumber } from '../validators/is-phone-number.decorator';
import { EgyptianCity } from '../enums/egyptian-cities.enum.ts';


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
    @IsNotEmpty()
    @IsPhoneNumber({ message: 'Phone number must be valid and in international format.' })
    phone: string;
  @IsNotEmpty()
  @IsEnum(EgyptianCity, { message: 'City must be one of the predefined Egyptian cities' })
  city: EgyptianCity;

}
