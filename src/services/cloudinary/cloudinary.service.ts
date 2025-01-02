import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { envs } from '@/config';

import * as streamifier from 'streamifier';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
@Injectable()
export class CloudinaryService {
  uploadFile(
    file: Express.Multer.File,
    folder = envs.cloudinary.folder_name,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadFromUrl(url: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        url,
        {
          folder: process.env.CLOUDINARY_FOLDER_NAME,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
    });
  }

  destroyFile(url: string): Promise<CloudinaryResponse> {
    const index = url.indexOf(envs.cloudinary.folder_name);
    const indexOfDot = url.indexOf('.', index);
    const publicId = url.slice(index, indexOfDot);
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  uploadFiles(
    file: Express.Multer.File,
    folder: string = 'default-folder',
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: file.mimetype.startsWith('image')
            ? 'image'  // Nếu file là ảnh, upload như ảnh
            : file.mimetype.startsWith('video')
            ? 'video'  // Nếu file là video, upload như video
            : 'raw',    // Nếu không phải ảnh hay video, upload như raw (tài liệu, âm thanh, v.v.)
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            ...result,
            fileName: file.originalname,  // Trả về tên file gốc
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}