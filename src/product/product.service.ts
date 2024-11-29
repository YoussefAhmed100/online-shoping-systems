import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model, isValidObjectId } from 'mongoose';
import { Product } from './schema/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { validateFiles } from 'src/utils/file.util';
import { Query } from 'express-serve-static-core';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Create a new product with multiple images
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
      validateFiles(files);
      const images = await this.uploadImagesToCloudinary(files);
      const product = new this.productModel({
        ...createProductDto,
        images
      });
      return product.save();
  
  }

  // Retrieve all products with pagination
  async findAll(query: Query): Promise<Product[]> {
 
      const resPerPage = 8; 
      const currentPage = Number(query.page) || 1;
      const skip = (currentPage - 1) * resPerPage;
      const keyword = query.keyword
        ? { title: { $regex: query.keyword, $options: 'i' } }
        : {};

      return await this.productModel.find({ ...keyword })
        .limit(resPerPage)
        .skip(skip)
        .populate({path:'category',select:"title-_id"})
        .exec();
  
  }

  // Retrieve a single product by ID
  async findOne(id: string): Promise<Product> {
   
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid  ID Format: ${id}`);
    }
      const product = await this.productModel.findById(id).populate({path:'category',select:'title-_id'});
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    
  }

  // Update a product by ID with optional new images
  async updateProduct(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
   
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid  ID Format: ${id}`);
    }
      if (files) validateFiles(files);

      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`Product with ${id} not found`);
      }

      if (files && files.length > 0) {
        await this.deleteExistingImages(product.images);
        updateProductDto.images = await this.uploadImagesToCloudinary(files);
      }

      Object.assign(product, updateProductDto);
      return product.save();
 
  }

  // Remove a product by ID and delete associated images
  async remove(id: string): Promise<string> {
  
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid  ID Format: ${id}`);
    }

      const product = await this.productModel.findById(id).exec();
      if (!product) {
        return 'Product not found';
      }

      await this.deleteExistingImages(product.images);
      await this.productModel.findByIdAndDelete(id).exec();

      return 'Product deleted successfully';
  
  }




  // Helper: Upload images to Cloudinary
  private async uploadImagesToCloudinary(files: Express.Multer.File[]) {
    try {
      const uploadedImages = await this.cloudinaryService.uploadImages(files);
      return uploadedImages.map((image) => ({
        url: image.url,
        publicId: image.publicId,
      }));
    } catch (error) {
      console.error("Error in uploadImagesToCloudinary:", error);
      throw new InternalServerErrorException('Failed to upload images');
    }
  }

  // Helper: Delete existing images from Cloudinary
  private async deleteExistingImages(images: { url: string; publicId: string }[]) {
    try {
      const deletePromises = images.map(image => this.cloudinaryService.deleteImage(image.publicId));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error in deleteExistingImages:", error);
      throw new InternalServerErrorException('Failed to delete existing images');
    }
  }
}
