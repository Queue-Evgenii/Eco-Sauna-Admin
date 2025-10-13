<script setup lang="ts">
import { RouterView } from 'vue-router';

const themeOverrides = {
  common: {
    warningColor: 'rgb(240, 160, 32)'
  },
}

</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider placement="bottom">
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>