import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ArcoResolver } from "unplugin-vue-components/resolvers";

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools({
      launchEditor: 'cursor',
    }),
    AutoImport({
      dts: "types/auto-imports.d.ts",
      dirs: ["src/components"],
      imports: ["vue", "vue-router"],
      resolvers: [ArcoResolver()],
    }),
    Components({
      dts: "types/components.d.ts",
      dirs: ["src/components"],
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'TMark',
        short_name: 'TMark',
        description: 'TMark',
        theme_color: '#F2F3F5',
        icons: [],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: false,
      },
      // 添加更新提示相关配置
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
  }
})
