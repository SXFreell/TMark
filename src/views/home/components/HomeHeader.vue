<template>
  <header class="home-header" :class="{ 'bottom-border': bottomBorder }">
    <div class="welcome">
      <div class="folder-name">
        <icon-left @click="back" class="back" :style="`font-size: 18px; cursor: pointer;${parentId !== '0' ? 'opacity: 1' : 'opacity: 0'}`" />
        <div class="name" :style="`${parentId !== '0' ? 'left: 24px' : 'left: 0'};${folderNameTransition ? 'opacity: 0' : 'opacity: 1'}`">{{ folderName }}</div>
        <div class="name" :style="`${parentId !== '0' ? 'left: 24px' : 'left: 0'};${folderNameTransition ? 'opacity: 1' : 'opacity: 0'}`">{{ folderNewName }}</div>
      </div>
    </div>
    <div :class="`icon-setting ${menuOpen ? 'menu-open' : ''}`">
      <icon-plus
        @click="menuOpen = !menuOpen"
        :class="`icon-plus ${menuOpen ? 'menu-open' : ''}`"
        style="font-size: 18; stroke-linecap: round; stroke-linejoin: round; stroke-width: 6;"
      />
      <HomeMenu
        class="menu"
        :open="menuOpen"
        @create-bookmark="handleCreateBookmark"
        @create-folder="handleCreateFolder"
        @setting="handleSetting"
        @close-menu="menuOpen = false"
      />
    </div>
    <a-drawer
      :drawer-style="{ backgroundColor: 'var(--color-fill-2)', borderRadius: '16px 16px 0 0' }"
      width="100vw"
      height="84vh"
      :header="false"
      :footer="false"
      :visible="visible"
      placement="bottom"
      @cancel="handleCancel"
      unmountOnClose
    >
      <div class="drawer-title user-select-none">
        <span class="cancel" @click="handleCancel">取消</span>
        <span class="ok" @click="handleOk">完成</span>
      </div>
      <div class="drawer-content">
        <div class="title">{{ drawerContent.title }}</div>
        <div class="form">
          <div
            class="form-item"
            v-for="item in drawerContent.form"
            :key="item.key"
          >
            <div class="form-item-label">{{ item.label }}</div>
            <a-input class="form-item-content" allow-clear @change="(value) => handleInputChange(item.key, value)" />
          </div>
        </div>
      </div>
    </a-drawer>
  </header>
</template>

<script setup lang="ts">
import HomeMenu from './HomeMenu.vue';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useThemeColor } from '@/hooks/useThemeColor';
import menu from '../constants/menu';
import { createBookmark, createFolder, getFolderById } from '@/api/db/bookmarks';
import emitter from '@/utils/eventBus';
import { useAppStore } from '@/stores/app';

const props = defineProps<{
  bottomBorder: boolean;
  parentId: string;
}>();

const { setThemeColor } = useThemeColor();
const visible = ref(false);
const menuOpen = ref(false);
const folderName = ref('');
const folderNewName = ref('');
const folderNameTransition = ref(false);
const { popParentId } = useAppStore();

const drawerContent = ref(menu.createBookmark);
let formData = reactive<Record<string, string>>({});

watch(() => props.parentId, async (newVal: string) => {
  folderNewName.value = await getFolderName(newVal);
  folderNameTransition.value = true;
  setTimeout(() => {
    folderNameTransition.value = false;
    folderName.value = folderNewName.value;
  }, 400);
});

onMounted(async () => {
  folderName.value = await getFolderName(props.parentId);
});

const handleClick = () => {
  visible.value = true;
  setThemeColor('#72757A');
};
const handleCancel = () => {
  visible.value = false;
  setThemeColor('#F2F3F5');
};
const handleOk = () => {
  if (drawerContent.value.title === menu.createBookmark.title) {
    if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      formData.url = 'https://' + formData.url;
    }
    createBookmark(formData.name, formData.url, props.parentId).then(() => {
      emitter.emit('refresh-bookmarks');
    });
  } else {
    createFolder(formData.name, props.parentId).then(() => {
      emitter.emit('refresh-bookmarks');
    });
  }
  handleCancel();
};

const handleInputChange = (key: string, value: string) => {
  formData[key] = value;
};

const handleCreateBookmark = () => {
  drawerContent.value = menu.createBookmark;
  formData = reactive<Record<string, string>>({});
  menu.createBookmark.form.forEach((item) => {
    formData[item.key] = '';
  });
  handleClick();
};

const handleCreateFolder = () => {
  drawerContent.value = menu.createFolder;
  formData = reactive<Record<string, string>>({});
  menu.createBookmark.form.forEach((item) => {
    formData[item.key] = '';
  });
  handleClick();
};

const handleSetting = () => {
  console.log('setting');
};

// 添加点击事件监听器
const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.icon-setting')) {
    menuOpen.value = false;
  }
};

const getFolderName = async (id: string) => {
  const folder = await getFolderById(id);
  return folder?.name || '';
};

const back = () => {
  popParentId();
  emitter.emit('refresh-bookmarks');
};

// 组件挂载时添加监听器，卸载时移除
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('touchstart', handleClickOutside);
});
</script>

<style scoped lang="scss">
.home-header {
  background-color: var(--color-fill-2);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--color-fill-2);
  transition: border-bottom 0.2s ease-in-out;
  &.bottom-border {
    border-bottom: 1px solid var(--color-border-2);
  }
  .welcome {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;
    line-height: 24px;
    color: var(--color-text-1);
    .folder-name {
      display: flex;
      align-items: center;
      position: relative;
      width: 100%;
      .back {
        transition: opacity 0.3s ease-in-out;
        position: absolute;
        left: 0;
        opacity: 0;
      }
      .name {
        transition: left 0.3s ease-in-out, opacity 0.3s ease-in-out;
        position: absolute;
      }
    }
  }
  .icon-setting {
    position: relative;
    .icon-plus {
      transform: rotate(0deg);
      transition: transform 0.2s ease-in-out;
      &.menu-open {
        transform: rotate(45deg);
      }
    }
    .menu {
      position: absolute;
      top: 28px;
      right: 8px;
      transform-origin: top right;
      transform: translateX(16px);
    }
  }
}
.drawer-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  line-height: 24px;
  color: rgb(var(--link-6));
  span:active {
    color: rgb(var(--link-7));
  }
  .ok {
    font-weight: 600;
  }
}

.drawer-content {
  padding-top: 16px;
  
  .title {
    font-size: 34px;
    font-weight: 700;
    line-height: 41px;
    letter-spacing: 0.374px;
    color: var(--color-text-1);
    margin-bottom: 8px;
  }

  .form {
    background-color: var(--color-bg-2);
    border-radius: 8px;
    overflow: hidden;
    .form-item {
      margin-left: 16px;
      border-bottom: 0.8px solid var(--color-border-2);
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: none;
      }
      .form-item-label {
        padding: 8px 16px 8px 0;
        font-size: 17px;
        color: var(--color-text-1);
      }

      .form-item-content {
        box-sizing: border-box;
        flex: 1;
        min-width: 0;
        padding: 8px 8px 8px 0;
        color: var(--color-text-2);
        overflow: hidden;
        background-color: var(--color-bg-2);
        border: none;
        :deep(input) {
          font-size: 17px !important;
          text-align: right;
          padding-right: 4px;
          &:hover {
            color: var(--color-text-1);
          }
        }
      }
    }
  }
}
</style>