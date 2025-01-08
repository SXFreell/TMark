<script setup lang="ts">
import { Modal } from "@arco-design/web-vue";
import zhCN from "@arco-design/web-vue/es/locale/lang/zh-cn";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    Modal.confirm({
      title: '发现新版本',
      content: '是否立即更新？',
      onOk: () => {
        updateSW() // 调用更新函数
      }
    })
  },
  onOfflineReady() {
    console.log('应用已准备好离线工作')
  },
})
</script>

<template>
  <a-config-provider :locale="zhCN">
    <router-view></router-view>
  </a-config-provider>
</template>