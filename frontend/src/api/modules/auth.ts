import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { UserDto } from "../../types/models/dto/user-dto";
import type { UserEntity } from "../../types/models/entities/user.entity";

export class AuthApi extends Api {
  constructor(apiClient: AxiosInstance) {
    super(apiClient, '/auth');
  }

  authorization = (payload: Partial<UserEntity>) => {
    return this.postRequest<UserDto, Partial<UserEntity>>('/login', payload);
  };
}