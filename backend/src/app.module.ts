import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TokenModule } from './modules/token/token.module';
import { ProductModule } from './modules/products/products.module';
import { MediaModule } from './modules/media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { OrdersModule } from './modules/orders/orders.module';
import { MailerModule } from '@nestjs-modules/mailer';
import TypeOrmDataSource from 'typeorm.config';
import MailerConfig from 'mailer.config';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...TypeOrmDataSource.options,
      }),
    }),

    MailerModule.forRoot(MailerConfig),

    UserModule,
    AuthModule,
    TokenModule,
    MediaModule,
    ProductModule,
    OrdersModule,
    SettingsModule,

    ServeStaticModule.forRoot(
      (() => {
        const publicDir = resolve('./uploads/');
        const servePath = '/uploads';

        return {
          rootPath: publicDir,
          serveRoot: servePath,
          exclude: ['/api*'],
        };
      })(),
    ),
  ],
})
export class AppModule {}
