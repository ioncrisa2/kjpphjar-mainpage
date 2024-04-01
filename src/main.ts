import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/css/app.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);

import appSetting from '@/app-setting';
appSetting.init();

AOS.init({
    once: true,
});

app.mount('#app');
