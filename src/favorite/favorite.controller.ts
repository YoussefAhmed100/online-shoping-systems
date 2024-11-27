import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { DeleteFavoriteDto } from './dto/delete-favorite.dto';
import { GetFavoritesDto } from './dto/git-favorite.dto';


@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async addFavorite(@Body() addFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.addFavorite(addFavoriteDto);
  }

  @Delete()
  async removeFavorite(@Body() removeFavoriteDto: DeleteFavoriteDto) {
    return this.favoriteService.removeFavorite(removeFavoriteDto);
  }

  @Get(':userId')
  async getFavorites(@Param() getFavoritesDto: GetFavoritesDto) {
    return this.favoriteService.getFavorites(getFavoritesDto);
  }
}
