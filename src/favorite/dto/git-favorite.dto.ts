import { IsNotEmpty, IsMongoId } from 'class-validator';

export class GetFavoritesDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}
