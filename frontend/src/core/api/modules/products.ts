import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { ProductEntity } from "@/core/types/models/entities/product.entity";
import type { ProductDto } from "@/core/types/models/dto/product-dto";

export class ProductsApi extends Api {
  constructor(apiClient: AxiosInstance) {
    super(apiClient, '/products');
  }
  
  getProductById = (id: number) => {
    return this.getRequest<ProductEntity>(`/${id}`);
  }

  getProducts = () => {
    return this.getRequest<ProductEntity[]>('/');
  }

  createProduct = (data: ProductDto) => {
    return this.postRequest<ProductEntity, ProductDto>('/', data);
  }

  updateProduct = (id: number, data: ProductDto) => {
    return this.patchRequest<ProductEntity, ProductDto>(`/${id}`, data);
  }

  deleteProduct = (id: number) => {
    return this.deleteRequest<void>(`/${id}`);
  }
}