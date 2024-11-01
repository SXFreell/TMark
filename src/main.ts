import { createApp } from "vue";
// 全局样式
import "@/assets/styles/index.scss";
// Vue Router
import router from "./routers";
// Arco Design Vue
import ArcoVue from "@arco-design/web-vue";
// Arco Design CSS
import "@arco-design/web-vue/dist/arco.css";

import App from "./App.vue";

createApp(App).use(router).use(ArcoVue).mount("#app");
