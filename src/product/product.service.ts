
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]):Promise<Product> {
    this.validateAndCheckFiles(files);

    const images = await this.uploadImagesToCloudinary(files);

    const product = new this.productModel({
      ...createProductDto,
      images,
    });
    return product.save();
  }

  // Retrieve all products with pagination
  async findAll(query:Query): Promise<Product[]> {
    const resPerPage=4  //add any number would you like
    const currentPage=Number(query.page)||1
    const skip=(currentPage-1)*resPerPage

    const keyword =query.keyword ?{
        title:{
            $regex:query.keyword,
            $options:'i'
        }
        
    }:{} 
    return await this.productModel.find({...keyword}).limit(resPerPage).skip(skip).populate('category')
  }

  // Retrieve a single product by ID
  async findOne(id: string): Promise<Product> {
    this.validateObjectId(id);

    const product = await (await this.productModel.findById(id)).populated("category").exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Update a product by ID with optional new images
  async updateProduct(id: string, updateProductDto: UpdateProductDto, files?: Express.Multer.File[]): Promise<Product> {
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
  }

  // Remove a product by ID and delete associated images
  async remove(id: string): Promise<string> {
    this.validateObjectId(id);

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      return 'Product not found';
    }

    await this.deleteExistingImages(product.images);
    await this.productModel.findByIdAndDelete(id).exec();

    return 'Product deleted successfully';
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
    const uploadedImages = await this.cloudinaryService.uploadImages(files);
    return uploadedImages.map((image) => ({
      url: image.url,
      publicId: image.publicId,
    }));
  }

  // Helper: Delete existing images from Cloudinary
  private async deleteExistingImages(images: { url: string; publicId: string }[]) {
    const deletePromises = images.map(image => this.cloudinaryService.deleteImage(image.publicId));
    await Promise.all(deletePromises);
  }
}
