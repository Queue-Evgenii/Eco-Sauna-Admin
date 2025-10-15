import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'supersecretkey',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
