import { createApp } from "vue";
// 全局样式
import "@/assets/styles/index.scss";
// Vue Router
import router from "./router";
// Arco Design Vue
import ArcoVue from "@arco-design/web-vue";
// Arco Design CSS
import "@arco-design/web-vue/dist/arco.css";
// Arco Design Icon
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
// IndexedDB 工具类
import { initDB } from "@/utils/indexedDB";
// Pinia
import { createPinia } from 'pinia';

import App from "./App.vue";

// 初始化数据库
initDB().then(() => {
  createApp(App).use(router).use(ArcoVue).use(ArcoVueIcon).use(createPinia()).mount("#app");
});
