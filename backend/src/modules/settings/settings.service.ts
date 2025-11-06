import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerSettings } from 'src/models/entities/mailer-settings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(MailerSettings)
    private readonly repo: Repository<MailerSettings>,
  ) {}

  async findAll(): Promise<MailerSettings[]> {
    return this.repo.find();
  }

  async findByKey(key: string): Promise<MailerSettings> {
    const template = await this.repo.findOne({ where: { key } });
    if (!template)
      throw new NotFoundException(`Template with key "${key}" not found`);
    return template;
  }

  async update(
    key: string,
    update: Partial<MailerSettings>,
  ): Promise<MailerSettings> {
    const template = await this.findByKey(key);
    Object.assign(template, update);
    return this.repo.save(template);
  }

  async create(create: Partial<MailerSettings>): Promise<MailerSettings> {
    const template = this.repo.create(create);
    return this.repo.save(template);
  }
}
