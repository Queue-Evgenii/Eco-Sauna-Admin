export interface MailerSettingsEntity {
  id: number;

  key: string;

  admin_email?: string;

  subject: string;

  body: string;

  created_at: Date;

  updated_at: Date;
}