import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { validateFiles } from 'src/utils/file.util';
import { Query } from 'express-serve-static-core';

@Injectable()
export class ProductsService {
  private readonly resPerPage = 2;

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // Create a new product with multiple images
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    try {
      this.validateAndCheckFiles(files);
      const images = await this.uploadImagesToCloudinary(files);
      const product = new this.productModel({
        ...createProductDto,
        images,
      });
      return product.save();
    } catch (error) {
      console.error("Error in create:", error);
      throw new InternalServerErrorException('An error occurred while creating the product');
    }
  }

  // Retrieve all products with pagination
  async findAll(query: Query): Promise<Product[]> {
    try {
      const resPerPage = 4;  // set as needed
      const currentPage = Number(query.page) || 1;
      const skip = (currentPage - 1) * resPerPage;
      const keyword = query.keyword
        ? { title: { $regex: query.keyword, $options: 'i' } }
        : {};

      return await this.productModel.find({ ...keyword })
        .limit(resPerPage)
        .skip(skip)
        .populate('category')
        .exec();
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new InternalServerErrorException('An error occurred while retrieving products');
    }
  }

  // Retrieve a single product by ID
  async findOne(id: string): Promise<Product> {
    try {
      this.validateObjectId(id);
      const product = await this.productModel.findById(id).populate("category").exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        console.error("Unexpected error in findOne:", error);
        throw new InternalServerErrorException('An unexpected error occurred');
      }
      throw error; 
    }
  }

  // Update a product by ID with optional new images
  async updateProduct(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
    try {
      this.validateObjectId(id);
      if (files) this.validateAndCheckFiles(files);

      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (files && files.length > 0) {
        await this.deleteExistingImages(product.images);
        updateProductDto.images = await this.uploadImagesToCloudinary(files);
      }

      Object.assign(product, updateProductDto);
      return product.save();
    } catch (error) {
      console.error("Error in updateProduct:", error);
      throw new InternalServerErrorException('An error occurred while updating the product');
    }
  }

  // Remove a product by ID and delete associated images
  async remove(id: string): Promise<string> {
    try {
      this.validateObjectId(id);

      const product = await this.productModel.findById(id).exec();
      if (!product) {
        return 'Product not found';
      }

      await this.deleteExistingImages(product.images);
      await this.productModel.findByIdAndDelete(id).exec();

      return 'Product deleted successfully';
    } catch (error) {
      console.error("Error in remove:", error);
      throw new InternalServerErrorException('An error occurred while deleting the product');
    }
  }

  // Helper: Validate ObjectId
  private validateObjectId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  }

  // Helper: Validate and check files
  private validateAndCheckFiles(files: Express.Multer.File[]) {
    validateFiles(files);
    if (!files || files.length === 0) {
      throw new BadRequestException('Product images are required');
    }
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
