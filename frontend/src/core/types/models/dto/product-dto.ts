import type { MediaFileEntity } from "../entities/media-file.entity";
import type { ProductPriceDto } from "./product-price-dto";

export interface ProductDto {
  title: string;

  description?: string;

  area?: number;

  capacity?: number;

  max_temperature?: number;

  image_id?: number;

  image?: MediaFileEntity,

  prices?: ProductPriceDto[],
}