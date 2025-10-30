import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { Product } from 'src/models/entities/product.entity';
import { ProductGallery } from 'src/models/entities/product-gallery.entity';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { ProductPrice } from 'src/models/entities/product-prices.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      MediaFile,
      ProductGallery,
      ProductPrice,
    ]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
