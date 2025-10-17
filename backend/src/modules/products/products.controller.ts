import { Controller, Inject } from '@nestjs/common';
import { ProductService } from './products.service';
import { TokenStrategy } from '../token/token.strategy';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}
}
