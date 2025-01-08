<template>
  <div class="scroll-area user-select-none" ref="scrollArea">
    <div class="bookmark-list-wrapper">
      <div class="bookmark-list">
        <div
          class="bookmark-item"
          v-for="item in bookmarks"
          :key="item.id"
          :ref="(el) => { if(el) bookmarkRefs[item.id] = {
            id: item.id,
            element: el,
            offset: 0
          } as BookmarkElement }"
          @touchstart="handleTouchStart($event, item)"
          @touchmove="handleTouchMove($event, item)"
          @touchend="handleTouchEnd($event, item)"
        >
          <div class="icon" v-if="item.type === 'folder'">
            <icon-folder />
          </div>
          <div class="icon" v-else-if="getIcon(item.url!)">
            <img :src="getIcon(item.url!)" :alt="item.name" />
          </div>
          <div class="icon" v-else>
            <icon-folder />
          </div>
          <div class="card">
            <div class="bookmark-title">{{ item.name }}</div>
            <div class="bookmark-url">{{ item.url }}</div>
          </div>
          <div class="delete-btn" @click.stop="handleDeleteBookmark(item)">
            删除
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Bookmark } from '@/api/interface';
import { getBookmarksByParentId, deleteBookmark } from '@/api/db/bookmarks';
import emitter from '@/utils/eventBus';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const { setParentId } = appStore;

const scrollArea = ref<HTMLElement | null>(null);

const bookmarks = ref<Bookmark[]>([]);

const currentDragId = ref<string>('');
const bookmarkRefs = ref<Record<string, BookmarkElement | undefined>>({});
type BookmarkElement = {
  id: string;
  element: HTMLElement;
  offset: number;
}

const touchStartX = ref(0);
const touchMoveX = ref(0);
const touchTime = ref(0);
const touchMoveFlag = ref(false);

onMounted(() => {
  emitter.on('refresh-bookmarks', () => {
    nextTick(() => {
      flushBookmarks();
    });
  });
  scrollArea.value?.addEventListener('scroll', (e) => {
    emit('scroll', e);
  });
  flushBookmarks();
});

onUnmounted(() => {
  emitter.off('refresh-bookmarks');
});

const props = defineProps<{
  parentId: string;
}>();

const emit = defineEmits<{
  (e: 'scroll', event: Event): void;
}>();

const flushBookmarks = () => {
  getBookmarksByParentId(props.parentId).then(res => {
    bookmarks.value = res;
    if(bookmarkRefs.value) {
      nextTick(() => {
        Object.values(bookmarkRefs.value).forEach(item => {
          if (item) {
            const elHeight = item!.element.clientHeight;
            item!.element.style.maxHeight = `${elHeight + 1}px`;
          }
        });
      });
    }
  });
};

const getIcon = (url: string) => {
  if (url) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return `https://cn.cravatar.com/favicon/api/index.php?url=${urlObj.hostname}`;
    } catch {
      return '';
    }
  }
  return '';
};

const openBookmark = (url: string | undefined, parentId: string) => {
  if (url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  } else {
    setParentId(parentId);
    emitter.emit('refresh-bookmarks');
  }
};

const handleTouchStart = (e: TouchEvent, item: Bookmark) => {
  touchTime.value = new Date().getTime();
  const currentEl = bookmarkRefs.value[currentDragId.value];
  if (currentEl && currentEl.id !== item.id) {
    currentEl.offset = 0;
    currentEl.element.style.transform = 'translateX(0)';
  }
  const el = bookmarkRefs.value[item.id];
  el!.element.style.transition = 'none';
  currentDragId.value = item.id;
  touchStartX.value = e.touches[0].clientX;
  touchMoveX.value = 0;
};

const handleTouchMove = (e: TouchEvent, item: Bookmark) => {
  touchMoveFlag.value = true;
  touchMoveX.value = e.touches[0].clientX - touchStartX.value;
  const el = bookmarkRefs.value[item.id];
  el!.element.style.transition = 'none';
  if (el) {
    const currentOffset = touchMoveX.value + el.offset;
    let targetOffset = currentOffset;
    if (currentOffset > 0) {
      targetOffset = 0;
    } else {
      targetOffset = currentOffset;
    }
    el.element.style.transform = `translateX(${targetOffset}px)`;
  }
};

const handleTouchEnd = (e: TouchEvent, item: Bookmark) => {
  if (!touchMoveFlag.value) {
    if (new Date().getTime() - touchTime.value < 300) {
      const target = e.target as HTMLElement;
      if (target.classList.contains('delete-btn')) {
        return;
      }
      openBookmark(item.url, item.id);
    } else {
      // ToDo: 打开菜单
    }
    return;
  }
  touchMoveFlag.value = false;
  const el = bookmarkRefs.value[item.id];
  el!.element.style.transition = 'all 0.3s ease-in-out';
  if (el) {
    if (touchMoveX.value < -40) {
      el.element.style.transform = 'translateX(-80px)';
      el.offset = -80;
    } else {
      el.element.style.transform = 'translateX(0)';
      el.offset = 0;
    }
  }
};

const handleDeleteBookmark = async (item: Bookmark) => {
  const el = bookmarkRefs.value[item.id];
  if (el) {
    el.element.style.transition = 'all 0.3s ease-in-out';
    el.element.style.maxHeight = '0';
    setTimeout(() => {
      bookmarks.value = bookmarks.value.filter(item => item.id !== el.id);
    }, 300);
  }
  bookmarkRefs.value[item.id] = undefined;
  deleteBookmark(item.id);
};
</script>

<style scoped lang="scss">
.scroll-area {
  padding: 16px 16px 32px;
  overflow-y: auto;
  .bookmark-list-wrapper {
    border-radius: 8px;
    overflow: hidden;
  }
  .bookmark-list {
    position: relative;
    border-radius: 8.5px;
    background-color: #ff4d4f;

    .bookmark-item {
      width: calc(100% + 80px);
      position: relative;
      background-color: var(--color-bg-2);
      display: flex;
      align-items: center;
      overflow: hidden;
      &:last-child {
        .card {
          border-bottom: none;
        }
      }
      .icon {
        font-size: 24px;
        color: var(--color-text-2);
        padding: 0 16px;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .card {
        flex: 1;
        min-width: 0;
        border-bottom: 0.8px solid var(--color-border-2);
        padding: 16px 16px 16px 0;
        position: relative;
        .bookmark-title {
          font-size: 17px;
          color: var(--color-text-1);
          margin-bottom: 4px;
        }
        .bookmark-url {
          font-size: 14px;
          color: var(--color-text-2);
        }
      }
      .delete-btn {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 80px;
        background-color: #ff4d4f;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
    }
  }
}
</style>
