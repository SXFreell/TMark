<template>
  <div :class="['menu-list', 'popover-shadow', { 'menu-open': open }]">
    <div
      v-for="item in menuItems"
      :key="item.id"
      class="menu-item"
      @click="handleMenuClick(item.id)"
    >
      <span>{{ item.label }}</span>
      <component
        :is="item.icon"
        style="font-size: 20; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    IconSubscribeAdd,
    IconFolderAdd,
    IconSettings,
  } from '@arco-design/web-vue/es/icon';

  defineProps<{
    open: boolean;
  }>();

  const emit = defineEmits(['create-bookmark', 'create-folder', 'setting', 'close-menu']);

  const menuItems = [
    { id: 1, label: '添加书签', icon: IconSubscribeAdd },
    { id: 2, label: '添加文件夹', icon: IconFolderAdd },
    { id: 3, label: '设置', icon: IconSettings },
  ];

  const handleMenuClick = (item: number) => {
    // 处理菜单点击事件
    emit('close-menu');
    emit(item === 1 ? 'create-bookmark' : item === 2 ? 'create-folder' : 'setting');
  };
</script>

<style scoped lang="scss">
  .menu-list {
    font-size: 18px;
    min-width: 180px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
    box-sizing: content-box;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    opacity: 0;
    scale: 0.2;

    &.menu-open {
      opacity: 1;
      scale: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      cursor: pointer;
      transition: background-color 0.2s;
      color: var(--color-text-1);
      border-bottom: 0.8px solid var(--color-border-2);

      &:last-child {
        border-bottom: none;
      }

      &:active {
        background-color: var(--color-fill-3);
      }
    }
  }
</style>
