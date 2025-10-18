import type { MediaFileEntity } from "./media-file.entity";

export interface ProductEntity {
  id: number;
  
  title: string;

  description?: string;

  area?: number;

  capacity?: number;

  max_temperature?: number;

  image?: MediaFileEntity;
}