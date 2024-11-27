// src/category/dto/update-category.dto.ts
import { IsString, Length, IsOptional, IsEnum } from 'class-validator';
import { CategoryType } from '../enums/category-type.enum';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(10, 200)
  description?: string;

  @IsOptional()
  image?: { url: string; publicId: string };

  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;
}
