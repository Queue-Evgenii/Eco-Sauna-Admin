import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenStrategy } from '../token/token.strategy';
import { TokenPayload } from 'src/models/token-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email } as TokenPayload;
    const token = this.tokenService.createToken(payload);

    return { access_token: token, user };
  }
}
