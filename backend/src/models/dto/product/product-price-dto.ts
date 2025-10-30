import { IsOptional, IsNumber, IsInt, IsDate, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductPriceDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(6)
  weekday?: number; // 0 = Sunday ... 6 = Saturday

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
