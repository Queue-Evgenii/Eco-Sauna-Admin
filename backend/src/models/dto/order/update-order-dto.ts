import { IsNotEmpty, IsEnum } from 'class-validator';
import { OrderStatus } from 'src/models/entities/order.entity';

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
