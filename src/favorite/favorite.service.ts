import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from './schema/favorite.schema';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { GetFavoritesDto } from './dto/git-favorite.dto';
;

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<FavoriteDocument>,
  ) {}

  async addFavorite(addFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    try {
      const { userId, productId } = addFavoriteDto;
      const favorite = await this.favoriteModel.create({ userId, productId });
      return favorite;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('This product is already in your favorites.');
      }
      throw error;
    }
  }

  async removeFavorite(removeFavoriteDto: DeleteFavoriteDto): Promise<void> {
    const { userId, productId } = removeFavoriteDto;
    const result = await this.favoriteModel.deleteOne({ userId, productId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Favorite not found.');
    }
  }

  async getFavorites(getFavoritesDto: GetFavoritesDto): Promise<Favorite[]> {
    const { userId } = getFavoritesDto;
    return this.favoriteModel.find({ userId }).populate('productId').exec();
  }
}
