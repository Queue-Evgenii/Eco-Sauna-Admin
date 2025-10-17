import { createApp } from 'vue'
import './style.css'
import app from './app.vue'
import { router } from './router'
import naive from 'naive-ui'
import { useApiProvider } from './api/api-provider'
import { createPinia } from 'pinia'
import i18n from './i18n'

const pinia = createPinia();
const instance = createApp(app);

instance.use(router);
instance.use(pinia as any);
instance.use(naive);
instance.use(i18n);

useApiProvider(instance);

instance.mount('#app');