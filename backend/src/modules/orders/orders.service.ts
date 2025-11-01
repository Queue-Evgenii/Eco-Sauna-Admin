import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/models/dto/order/create-order-dto';
import { Order, OrderStatus } from 'src/models/entities/order.entity';
import { ProductPrice } from 'src/models/entities/product-prices.entity';
import { Product } from 'src/models/entities/product.entity';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductPrice)
    private readonly priceRepo: Repository<ProductPrice>,
  ) {}

  async create(data: CreateOrderDto): Promise<Order> {
    const product = await this.productRepo.findOne({
      where: { id: data.product_id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (start > end) {
      throw new BadRequestException('Invalid date range');
    }

    const overlapping = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.product_id = :productId', { productId: product.id })
      .andWhere('order.status = :status', { status: OrderStatus.ACCEPTED })
      .andWhere('(order.start_date <= :end AND order.end_date >= :start)', {
        start,
        end,
      })
      .getExists();

    if (overlapping) {
      throw new BadRequestException('This period is already booked');
    }

    const productPrices = await this.priceRepo.find({
      where: { product: { id: product.id } },
    });

    if (!productPrices.length) {
      throw new BadRequestException('No prices defined for this product');
    }

    for (const price of productPrices) {
      if (price.date && typeof price.date === 'string') {
        price.date = new Date(price.date);
      }
    }

    let totalPrice = 0;
    const current = new Date(start);

    while (current <= end) {
      const weekday = current.getDay(); // 0-6

      let price = productPrices.find(
        (p) =>
          p.date &&
          p.date.toISOString().slice(0, 10) ===
            current.toISOString().slice(0, 10),
      );

      if (!price) {
        price = productPrices.find((p) => p.weekday === weekday);
      }

      if (!price) {
        price = productPrices[0];
      }

      totalPrice += Number(price.price);
      current.setDate(current.getDate() + 1);
    }

    const order = this.orderRepo.create({
      ...data,
      product,
      total_price: totalPrice,
    });

    return await this.orderRepo.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepo.find({
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);

    if (status === OrderStatus.ACCEPTED) {
      const overlapping = await this.orderRepo.exists({
        where: {
          product: { id: order.product?.id },
          status: OrderStatus.ACCEPTED,
          start_date: LessThanOrEqual(order.end_date),
          end_date: MoreThanOrEqual(order.start_date),
        },
      });
      if (overlapping) {
        throw new BadRequestException(
          'Cannot accept: time period is already booked',
        );
      }
    }

    order.status = status;
    return await this.orderRepo.save(order);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
  }
}
