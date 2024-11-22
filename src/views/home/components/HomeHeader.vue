<template>
  <header class="home-header">
    <div class="welcome">
      <span class="hello">你好，</span><span class="name">{{ userName }}</span>
    </div>
    <div class="icon-setting">
      <icon-settings size="size-small" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const userName = ref('星落可');
</script>

<style scoped lang="scss">
.home-header {
  background-color: var(--color-bg-1);
  padding: 20px 12px;
  display: flex;
  align-items: center;
  .welcome {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    color: var(--color-text-1);
    .name {
      color: rgb(var(--primary-6));
    }
  }
  .icon-setting {
    font-size: 24px;
  }
}
</style>