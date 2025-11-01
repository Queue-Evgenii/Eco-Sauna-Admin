import { IsString, IsOptional, IsInt, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  customer_name: string;

  @IsString()
  customer_phone: string;

  @IsOptional()
  @IsString()
  customer_email?: string;

  @IsOptional()
  @IsString()
  customer_message: string;

  @Type(() => Date)
  @IsDate()
  start_date: Date;

  @Type(() => Date)
  @IsDate()
  end_date: Date;

  @Type(() => Number)
  @IsInt()
  product_id: number;
}
