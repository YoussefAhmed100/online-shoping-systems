import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const {  title,type } = createCategoryDto;
      const existcategory = await this.categoryModel.findOne({title,  type });
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
    } catch (error) {
      console.log(error)
      throw new BadRequestException('error in create category');
    }
  }

  // Retrieve all categories
  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryModel.find().exec();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new InternalServerErrorException('An error occurred while retrieving categories');
    }
  }

  // Retrieve a single category by ID
  async findOne(id: string): Promise<Category> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }

      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      console.error("Error in findOne:", error);
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  // Update a category by ID
  async update(id: string, updateCategoryDto: UpdateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    try {
      validateSingleFile(file); // Validate the single file

      const category = await this.categoryModel.findById(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      if (file) {
        // Delete old image if present, then upload new image to Cloudinary
        if (category.image?.publicId) {
          await this.deleteImageFromCloudinary(category.image.publicId.toString());
        }
        const uploadedImage = await this.uploadImage(file);
        updateCategoryDto.image = uploadedImage;
      }

      Object.assign(category, updateCategoryDto);
      return category.save();
    } catch (error) {
      console.error("Error in update:", error);
      throw new InternalServerErrorException('An error occurred while updating the category');
    }
  }

  // Delete a category by ID
  async delete(id: string): Promise<Category> {
    try {
      const category = await this.categoryModel.findByIdAndDelete(id).exec();
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      if (category.image?.publicId) {
        await this.deleteImageFromCloudinary(category.image.publicId.toString());
      }

      return category;
    } catch (error) {
      console.error("Error in delete:", error);
      throw new InternalServerErrorException('An error occurred while deleting the category');
    }
  }

  // Helper function to delete an image from Cloudinary
  private async deleteImageFromCloudinary(publicId: string): Promise<void> {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error in deleteImageFromCloudinary:", error);
      throw new BadRequestException('Failed to delete image from Cloudinary');
    }
  }

  // Helper function to handle image upload to Cloudinary
  private async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    try {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      return { url: uploadedImage.url, publicId: uploadedImage.publicId };
    } catch (error) {
      console.error("Error in uploadImage:", error);
      throw new BadRequestException('Failed to upload image to Cloudinary');
    }
  }
}
