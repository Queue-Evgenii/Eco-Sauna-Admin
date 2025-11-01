import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { OrderEntity } from "@/core/types/models/entities/order.entity";
import type { OrderStatusDto } from "@/core/types/models/dto/order-status-dto";

export class OrdersApi extends Api {
  constructor(apiClient: AxiosInstance) {
    super(apiClient, '/orders');
  }
  
  getOrderById = (id: number) => {
    return this.getRequest<OrderEntity>(`/${id}`);
  }

  getOrders = () => {
    return this.getRequest<OrderEntity[]>('/');
  }

  updateOrderStatus = (id: number, data: OrderStatusDto) => {
    return this.patchRequest<OrderEntity, OrderStatusDto>(`/${id}`, data);
  }

  deleteOrder = (id: number) => {
    return this.deleteRequest<void>(`/${id}`);
  }
}