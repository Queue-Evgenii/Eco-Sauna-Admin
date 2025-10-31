import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/models/dto/product/create-product-dto';
import { ProductPriceDto } from 'src/models/dto/product/product-price-dto';
import { UpdateProductDto } from 'src/models/dto/product/update-product-dto';
import { MediaFile } from 'src/models/entities/media-file.entity';
import { ProductGallery } from 'src/models/entities/product-gallery.entity';
import { ProductPrice } from 'src/models/entities/product-prices.entity';
import { Product } from 'src/models/entities/product.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(MediaFile)
    private readonly mediaRepository: Repository<MediaFile>,

    @InjectRepository(ProductGallery)
    private readonly productGalleryRepository: Repository<ProductGallery>,

    @InjectRepository(ProductPrice)
    private readonly productPriceRepository: Repository<ProductPrice>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['image', 'gallery', 'gallery.image'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['image', 'gallery', 'gallery.image', 'prices'],
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

    const savedProduct = await this.productRepository.save(product);

    await this.attachGallery(savedProduct.id, data.gallery_ids);
    await this.attachPrices(savedProduct.id, data.prices);

    return savedProduct;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (data.image_id) {
      const image = await this.mediaRepository.findOne({
        where: { id: data.image_id },
      });
      if (image) product.image = image;
    }

    Object.assign(product, { ...data, prices: undefined, gallery: undefined });

    const savedProduct = await this.productRepository.save(product);

    await this.attachGallery(savedProduct.id, data.gallery_ids);
    await this.attachPrices(savedProduct.id, data.prices);

    return savedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private async attachPrices(
    productId: number,
    prices?: ProductPriceDto[],
  ): Promise<void> {
    if (!prices) prices = [];

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product)
      throw new NotFoundException(`Product #${productId} not found`);

    const existingPrices = await this.productPriceRepository.find({
      where: { product: { id: productId } },
    });

    const incomingIds = prices.filter((p) => p.id).map((p) => p.id);

    const toDelete = existingPrices.filter((p) => !incomingIds.includes(p.id));
    if (toDelete.length) {
      await this.productPriceRepository.remove(toDelete);
    }

    for (const priceDto of prices) {
      if (priceDto.id) {
        const existing = existingPrices.find((p) => p.id === priceDto.id);
        if (existing) {
          existing.price = priceDto.price;
          existing.weekday = priceDto.weekday;
          existing.date = priceDto.date ? new Date(priceDto.date) : undefined;
          await this.productPriceRepository.save(existing);
        }
      } else {
        const newPrice = this.productPriceRepository.create();
        newPrice.product = product;
        newPrice.price = priceDto.price;
        newPrice.weekday = priceDto.weekday;
        newPrice.date = priceDto.date ? new Date(priceDto.date) : undefined;
        await this.productPriceRepository.save(newPrice);
      }
    }
  }

  private async attachGallery(
    productId: number,
    gallery_ids?: number[],
  ): Promise<void> {
    if (!gallery_ids) gallery_ids = [];

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const gallery = await this.mediaRepository.find({
      where: { id: In(gallery_ids) },
    });

    const existing = await this.productGalleryRepository.find({
      where: { product: { id: productId } },
      relations: ['image'],
    });

    const existingMap = new Map(existing.map((item) => [item.image.id, item]));

    const toSave: ProductGallery[] = [];

    for (const [index, el] of gallery.entries()) {
      const existingItem = existingMap.get(el.id);

      if (existingItem) {
        existingItem.position = index;
        toSave.push(existingItem);
      } else {
        const newImage = this.productGalleryRepository.create({
          product,
          image: el,
          position: index,
        });
        toSave.push(newImage);
      }
    }

    const toRemove = existing.filter(
      (item) => !gallery_ids.includes(item.image.id),
    );

    if (toRemove.length > 0) {
      await this.productGalleryRepository.remove(toRemove);
    }

    if (toSave.length > 0) {
      await this.productGalleryRepository.save(toSave);
    }
  }
}
