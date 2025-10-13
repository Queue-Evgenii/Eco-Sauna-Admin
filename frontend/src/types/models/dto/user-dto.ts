import type { UserEntity } from "../entities/user.entity";

export interface UserDto {
  access_token: string;

  user: UserEntity
}