import { Controller, Post, Get, Put, Delete, Body, Param, UploadedFiles, UseInterceptors,  Patch,  Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './product.service';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import{Query as ExpressQuery} from 'express-serve-static-core'
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Product } from './schema/product.schema';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  @UseInterceptors(FilesInterceptor('file', 5))
 
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(createProductDto, files);
  }
  @Roles(Role.Moderator,Role.Admin,Role.User)
  @Get('allProduct')
 
  // @UseGuards(AuthGuard(),RolesGuard)
  findAll(@Query() query: ExpressQuery):Promise<Product[]> {
 
    return this.productService.findAll(query);
  }
  @Roles(Role.Moderator,Role.Admin,Role.User)
  @Get(':id')
  findOne(@Param('id') id: string):Promise<Product> {
    return this.productService.findOne(id);
  }
  // ****************************
  @Patch(':id')
  @SkipThrottle()
  @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.productService.updateProduct(id, updateProductDto, files);
  }

 

  @Delete(':id')
  @SkipThrottle()
  @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
   
  }
}