import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { MailerSettings } from 'src/models/entities/mailer-settings.entity';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('mailer')
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<MailerSettings[]> {
    return this.service.findAll();
  }

  @Get('mailer/:key')
  @UseGuards(JwtAuthGuard)
  findByKey(@Param('key') key: string): Promise<MailerSettings> {
    return this.service.findByKey(key);
  }

  @Patch('mailer/:key')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('key') key: string,
    @Body() update: Partial<MailerSettings>,
  ): Promise<MailerSettings> {
    return this.service.update(key, update);
  }
}
