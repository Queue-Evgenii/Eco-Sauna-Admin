import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register-initial')
  async registerInitial(@Body() body: { email: string; password: string }) {
    const user = await this.userService.createInitialUser(
      body.email,
      body.password,
    );
    return { message: 'Initial user created', user };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  check() {
    return { message: 'You are authenticated!' };
  }
}
