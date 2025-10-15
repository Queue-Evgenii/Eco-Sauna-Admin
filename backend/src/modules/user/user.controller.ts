import {
  Controller,
  Request,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { TokenStrategy } from '../token/token.strategy';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject('TokenService') private readonly tokenService: TokenStrategy,
  ) {}

  @Get('me')
  getMe(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const header = req.headers['authorization'] as string;
    if (header === undefined)
      throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);

    const token = header.split(' ')[1];

    const payload = this.tokenService.decodeToken(token);

    return this.userService.findByEmail(payload.email);
  }
}
