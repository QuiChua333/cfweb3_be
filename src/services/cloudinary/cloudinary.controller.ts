import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinary: CloudinaryService) {}

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files')) // "files" là tên field trong FormData
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Upload các file lên Cloudinary
    const uploadResults = await Promise.all(
      files.map((file) => this.cloudinary.uploadFiles(file)),
    );
    console.log(uploadResults);

    // Trả về thông tin của các file đã upload
    return uploadResults.map((result) => ({
      url: result.secure_url,
      fileName: result.fileName, // Tên file gốc khi upload
      public_id: result.asset_id, 
    }));
  }

}
