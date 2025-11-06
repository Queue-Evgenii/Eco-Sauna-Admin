import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { MailerSettingsEntity } from "@/core/types/models/entities/mailer-settings.entity";

export class MailerSettingsApi extends Api {
  constructor(apiClient: AxiosInstance) {
    super(apiClient, '/settings/mailer');
  }

  getSettings = () => {
    return this.getRequest<MailerSettingsEntity[]>('/');
  }

  update = (key: string, data: Partial<MailerSettingsEntity>) => {
    return this.patchRequest<MailerSettingsEntity, Partial<MailerSettingsEntity>>(`/${key}`, data);
  }
}