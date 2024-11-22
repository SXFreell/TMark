<template>
  <div class="bookmark-list">
    <div class="bookmark-item" v-for="item in new Array(20).fill(0)">
      <div class="bookmark-title">Vue 3.0.{{ item }}</div>
      <div class="bookmark-url">https://v3.cn.vuejs.org/</div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.bookmark-list {
  padding: 12px;
  overflow-y: auto;
  .bookmark-item {
    padding: 12px;
    background-color: var(--color-bg-2);
    border-radius: 8px;
    margin-bottom: 12px;
    .bookmark-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-bottom: 4px;
    }
    .bookmark-url {
      font-size: 14px;
      color: var(--color-text-2);
    }
  }
}
</style>