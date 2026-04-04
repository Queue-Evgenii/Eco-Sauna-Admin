<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useUserStore } from '@/core/stores/user';
import type { UserApi } from '@/core/api/modules/user';
import { withErrorHandling } from './core/api/api-error-handler';

const themeOverrides = {
  common: {
    warningColor: 'rgb(240, 160, 32)'
  },
};

onMounted(() => {
  const userStore = useUserStore();
  const userApi = inject<UserApi>('UserApi')!;

  withErrorHandling(userApi.getMe())
    .then(res => {
      userStore.setUser(res);
    })
    .catch(() => {
      userStore.clearState();
    })
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider placement="bottom">
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>