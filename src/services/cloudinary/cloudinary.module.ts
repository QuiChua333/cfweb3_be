import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '@/constants';
import { envs } from '@/config';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: CLOUDINARY,
      useFactory: () => cloudinary.config(envs.cloudinary),
    },
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
