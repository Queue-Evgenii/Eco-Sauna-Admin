import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/models/entities/product.entity';
import { ProductPrice } from 'src/models/entities/product-prices.entity';
import { Order } from 'src/models/entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NotificationsService } from './notification.service';
import { MailerSettings } from 'src/models/entities/mailer-settings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, ProductPrice, MailerSettings]),
  ],
  providers: [OrdersService, NotificationsService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
