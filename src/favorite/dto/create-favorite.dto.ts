import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;
}
