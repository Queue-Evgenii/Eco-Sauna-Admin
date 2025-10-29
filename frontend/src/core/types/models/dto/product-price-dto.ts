export interface ProductPriceDto {
  id?: number;

  weekday?: number | null;

  date?: string | null;

  price: number;

  start_time?: string;

  end_time?: string;
}