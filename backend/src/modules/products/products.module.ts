import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { Product } from 'src/models/entities/product.entity';
import { ProductGallery } from 'src/models/entities/product-galler.entity';
import { MediaFile } from 'src/models/entities/media-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, MediaFile, ProductGallery])],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
