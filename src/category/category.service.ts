// src/category/category.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { validateSingleFile } from 'src/utils/file.util';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import cloudinary from 'cloudinary';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Create a new category
  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    const { name,type } = createCategoryDto;
    const existcategory = await this.categoryModel.findOne({ name ,type});
    if (existcategory) {
      throw new BadRequestException('Category already exists');
      }

    
    validateSingleFile(file); // Validate the single file

    if (!file) {
      throw new BadRequestException('Category image is required');
    }
 
    const image = await this.uploadImage(file);

    const category = new this.categoryModel({
      ...createCategoryDto,
      image,
    });
    return category.save();
  }

  // Retrieve all categories
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  // Retrieve a single category by ID
  async findOne(id: string): Promise<Category> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Update a category by ID
  async update(id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    validateSingleFile(file); // Validate the single file

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    if (file) {
      // If a new file is provided, delete the old image from Cloudinary
      if (category.image?.publicId) {
        await this.deleteImageFromCloudinary(category.image.publicId.toString());
      }

      // Upload the new image to Cloudinary
      const uploadedImage = await this.uploadImage(file);
      updateCategoryDto.image = uploadedImage;
    }

    // Merge the updated fields into the existing category and save
    Object.assign(category, updateCategoryDto);
    return category.save();
  }

  // Delete a category by ID
  async delete(id: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    if (category.image?.publicId) {
      await this.deleteImageFromCloudinary(category.image.publicId.toString());
    }


    return category;
  }

    // Helper function to delete the old image from Cloudinary
   private  async deleteImageFromCloudinary(publicId: string): Promise<void> {
      if (publicId) {
        try {
          await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
          throw new BadRequestException('Failed to delete image from Cloudinary');
        }
      }
    }
  
    // Helper function to handle image upload to Cloudinary
    private async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
      try {
        const uploadedImage = await this.cloudinaryService.uploadImage(file);
        return { url: uploadedImage.url, publicId: uploadedImage.publicId };
      } catch (error) {
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
    }
}
