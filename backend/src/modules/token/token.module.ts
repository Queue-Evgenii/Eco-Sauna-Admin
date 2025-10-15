import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'bad_secret_key'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  providers: [
    {
      provide: 'TokenService',
      useClass: TokenService,
    },
  ],
  exports: ['TokenService'],
})
export class TokenModule {}
