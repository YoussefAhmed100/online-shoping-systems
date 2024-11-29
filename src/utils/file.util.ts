import { BadRequestException } from '@nestjs/common';

const allowedTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif','image/jfif']; 
const maxSize = 2 * 1024 * 1024; // 2MB in bytes
let maxFiles = 5; 

// Function to validate multiple files
// @desc for products
export const validateFiles = (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new BadRequestException('Product images are required');
  }

  if (files.length > maxFiles) {
    throw new BadRequestException(`Cannot upload more than ${maxFiles} files.`);
  }

  for (const file of files) {
    if (!file) {
      throw new BadRequestException('A file was not provided.');
    }
  
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type for ${file.originalname}. Only JPEG, PNG, JFIF, and GIF files are allowed.`);
    }
  
    if (file.size > maxSize) {
      throw new BadRequestException(`${file.originalname} exceeds the maximum size limit of 2MB.`);
    }
  }
};

// @desc for category 

export const validateSingleFile = (file: Express.Multer.File) => {
  maxFiles=1
  if (!file) {
    throw new BadRequestException('No file provided for upload.');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
  }

  if (file.size > maxSize) {
    throw new BadRequestException('File size exceeds the maximum limit of 2MB.');
  }
};
