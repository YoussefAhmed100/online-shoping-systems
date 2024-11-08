import { BadRequestException } from '@nestjs/common';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; 
const maxSize = 2 * 1024 * 1024; // 2MB in bytes
let maxFiles = 5; 

// Function to validate multiple files
export const validateFiles = (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new BadRequestException('No files provided for upload.');
  }

  if (files.length > maxFiles) {
    throw new BadRequestException(`Cannot upload more than ${maxFiles} files.`);
  }

  for (const file of files) {
    if (!file) {
      throw new BadRequestException('No file provided for upload.');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
    }

    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds the maximum limit of 2MB.');
    }
  }
};

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
