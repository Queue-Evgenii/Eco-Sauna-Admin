import { Controller, Inject } from '@nestjs/common';
import { MediaService } from './media.service';
import { TokenStrategy } from '../token/token.strategy';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}
}
