import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier'




@Injectable()
export class CloudinaryService {
  async uploadImages(files: Express.Multer.File[]): Promise<{ url: string; publicId: string; }[]> {
    const uploadPromises = files.map(file => {
      return new Promise<{ url: string; publicId: string; }>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        }).end(file.buffer);
      });
    });

    return Promise.all(uploadPromises);
  }



  // Uploads a single image and returns only { url, publicId }
  async uploadImage(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'products' }, // Optional: set a folder to organize images
        (error, result) => {
          if (error) return reject(error);

          // Return only the url and publicId from the result
          resolve({
            url: result.secure_url,  // secure_url from Cloudinary response
            publicId: result.public_id,  // public_id from Cloudinary response
          });
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }


  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  














}
