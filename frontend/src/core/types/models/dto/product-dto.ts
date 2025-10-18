import type { MediaFileEntity } from "../entities/media-file.entity";

export interface ProductDto {
  title: string;

  description?: string;

  area?: number;

  capacity?: number;

  max_temperature?: number;

  image_id?: number;

  image?: MediaFileEntity,
}