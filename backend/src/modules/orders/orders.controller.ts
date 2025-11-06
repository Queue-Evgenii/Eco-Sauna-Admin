import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { OrdersService } from './orders.service';
import { Order } from 'src/models/entities/order.entity';
import { CreateOrderDto } from 'src/models/dto/order/create-order-dto';
import { UpdateOrderDto } from 'src/models/dto/order/update-order-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  count(): Promise<number> {
    return this.ordersService.count();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('per_page') perPage: string,
    @Query('page') page: string,
  ): Promise<Order[]> {
    const perPageNumber = perPage ? parseInt(perPage, 10) : 100;
    const pageNumber = page ? parseInt(page, 10) : 1;

    return this.ordersService.findAll(perPageNumber, pageNumber);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, data.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
