import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { TokenRequestDto } from 'src/models/dto/token-dto';
import { TokenStrategy } from 'src/modules/token/token.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IncomingMessage>();
    const tokenInstance = new TokenRequestDto(
      request.headers.authorization as string,
    );

    const token = tokenInstance.getToken();
    return this.tokenService.verifyToken(token);
  }
}
