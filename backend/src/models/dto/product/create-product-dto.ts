import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductPriceDto } from './product-price-dto';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  area?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  capacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  max_temperature?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  image_id?: number;

  @IsOptional()
  @Type(() => Array<ProductPriceDto>)
  prices?: Array<ProductPriceDto>;

  @IsOptional()
  @Type(() => Array<number>)
  gallery_ids?: Array<number>;
}
