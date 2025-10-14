<script setup lang="ts">
import { onMounted } from 'vue';
import LayoutDefault from '../../layouts/layout-default.vue';
import { useUserStore } from '../../stores/user';
import { useRouter } from 'vue-router';
import { RouteName } from '../../types/constants/route-name';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  if (userStore.user === undefined) {
    return router.push({ name: RouteName.AUTH.SIGN_IN });
  }
})

</script>

<template>
    <layout-default>
        <router-view />
    </layout-default>
</template>