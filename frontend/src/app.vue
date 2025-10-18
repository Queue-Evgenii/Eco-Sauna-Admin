<script setup lang="ts">
import { inject } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/core/stores/user';
import type { UserApi } from '@/core/api/modules/user';

const themeOverrides = {
  common: {
    warningColor: 'rgb(240, 160, 32)'
  },
};

(async () => {
  const userStore = useUserStore();
  const userApi = inject<UserApi>('UserApi')!;

  const res = await userApi.getMe();
  userStore.setUser(res);
})();
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider placement="bottom">
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>