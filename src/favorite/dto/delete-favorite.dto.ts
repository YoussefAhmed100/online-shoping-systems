import { IsNotEmpty, IsMongoId } from 'class-validator';

export class DeleteFavoriteDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsMongoId()
  productId: string;
}
