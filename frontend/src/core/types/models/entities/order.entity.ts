import type { ProductEntity } from "./product.entity";

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
};

export interface OrderEntity {
  id: number;

  product: ProductEntity;

  customer_name: string;

  customer_phone: string;

  customer_email: string;

  customer_message: string;

  start_date: Date;

  end_date: Date;

  status: OrderStatus;

  total_price?: number;

  created_at: Date;

  updated_at: Date;
}