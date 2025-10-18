import { createApp } from 'vue'
import './style.css'
import app from './app.vue'
import { router } from '@/core/router'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import i18n from '@/core/i18n'
import apiProvider from './core/api/api-provider'

const pinia = createPinia();
const instance = createApp(app);

instance.use(router);
instance.use(pinia as any);
instance.use(naive);
instance.use(i18n);
instance.use(apiProvider);

instance.mount('#app');