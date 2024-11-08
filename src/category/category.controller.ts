import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';
import { Category } from './schema/category.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Post()
  @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  @UseInterceptors(FileInterceptor('file')) // 'file' is the field name in the form
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Category> {
    if (!file) {
      throw new BadRequestException('Category image is required');
    }
    return this.categoryService.create(createCategoryDto, file);
  }

  // Retrieve all categories
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  // Retrieve a single category by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  // Update a category by ID
  @Put(':id')
  @Roles(Role.Moderator,Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  @UseInterceptors(FileInterceptor('file')) // Optional file upload
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto, file);
  }

  // Delete a category by ID
  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard(),RolesGuard)
  async delete(@Param('id') id: string): Promise<string> {
   await this.categoryService.delete(id);
   return 'Category deleted successfully';
  }
}
