import { defineStore } from 'pinia';
import type { UserEntity } from '../types/models/entities/user.entity';

interface UserState {
  _user: UserEntity | undefined;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    _user: undefined,
  }),
  getters: {
    user(): UserEntity | undefined {
      return this._user;
    },
  },
  actions: {
    setUser(user: UserEntity) {
      this._user = { ...user };
    },
    clearState(): void {
      this._user = undefined;
    },
  },
});