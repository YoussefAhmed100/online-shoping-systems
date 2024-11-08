import { IsString, IsNotEmpty, Length, IsOptional, IsEnum } from 'class-validator';
import { CategoryType } from '../enums/category-type.enum';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsEnum(CategoryType)
  @IsNotEmpty()
  type: CategoryType;
}
