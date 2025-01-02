import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '@/constants';
import { envs } from '@/config';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [
    CloudinaryService,
    {
      provide: CLOUDINARY,
      useFactory: () => cloudinary.config(envs.cloudinary),
    },
  ],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
