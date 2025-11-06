import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerSettings } from 'src/models/entities/mailer-settings.entity';
import { Order } from 'src/models/entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    private mailerService: MailerService,

    @InjectRepository(MailerSettings)
    private readonly mailerSettingsRepo: Repository<MailerSettings>,
  ) {}

  async sendOrderCreated(order: Order) {
    const template = await this.mailerSettingsRepo.findOne({
      where: { key: 'order_created' },
    });

    if (!template) {
      console.warn('ORSDER NOTIFICATION SERVICE: tempalte not exists');
      return;
    }

    const adminEmail = template?.admin_email;

    if (!adminEmail) {
      console.warn('ORSDER NOTIFICATION SERVICE: admin_email not exists');
      return;
    }

    const body = template.body
      .replace('{{product}}', order.product?.title || '')
      .replace('{{start_date}}', order.start_date.toISOString().slice(0, 10))
      .replace('{{end_date}}', order.end_date.toISOString().slice(0, 10))
      .replace('{{total_price}}', order.total_price?.toString() || '')
      .replace('{{customer_name}}', order.customer_name || '')
      .replace('{{customer_phone}}', order.customer_phone || '')
      .replace('{{customer_email}}', order.customer_email || '');

    let subject = template.subject || '';
    if (subject.includes('{{order_id}}')) {
      subject = subject.replace('{{order_id}}', order.id.toString());
    } else if (!subject) {
      subject = `New order #${order.id}`;
    }

    await this.mailerService.sendMail({
      to: adminEmail,
      subject,
      text: body,
    });

    if (order.customer_email) {
      await this.mailerService.sendMail({
        to: order.customer_email,
        subject,
        text: body,
      });
    }
  }
}
