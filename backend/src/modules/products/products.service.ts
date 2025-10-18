import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/models/dto/product/create-product-dto';
import { UpdateProductDto } from 'src/models/dto/product/update-product-dto';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { Product } from 'src/models/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(MediaFile)
    private readonly mediaRepository: Repository<MediaFile>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['image', 'gallery', 'gallery.image'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['image', 'gallery', 'gallery.image'],
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create();

    product.title = data.title;
    product.description = data.description;
    product.area = data.area;
    product.capacity = data.capacity;
    product.max_temperature = data.max_temperature;

    if (data.image_id) {
      product.image =
        (await this.mediaRepository.findOne({
          where: { id: data.image_id },
        })) ?? undefined;
      if (!product.image) {
        throw new NotFoundException(`Image #${data.image_id} not found`);
      }
    }

    return this.productRepository.save(product);
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (data.image_id) {
      const image = await this.mediaRepository.findOne({
        where: { id: data.image_id },
      });
      if (image) product.image = image;
    }

    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
