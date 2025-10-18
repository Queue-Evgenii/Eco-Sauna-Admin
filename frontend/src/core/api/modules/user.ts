import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { UserEntity } from "@/core/types/models/entities/user.entity";

export class UserApi extends Api {
  constructor(apiClient: AxiosInstance) {
    super(apiClient, '/user');
  }

  getMe = () => {
    return this.getRequest<UserEntity>('/me');
  }
}