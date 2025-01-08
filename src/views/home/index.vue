<template>
  <div class="AppMain">
    <HomeHeader
      class="HomeHeader user-select-none"
      :bottom-border="HomeHeaderBottomBorder"
      :parent-id="parentId"
    />
    <BookmarkList
      class="BookmarkList"
      :parent-id="parentId"
      @scroll="handleBookmarkListScroll"
    />
  </div>

</template>

<script setup lang="ts">
defineOptions({
  name: 'HomeIndex'
})

import HomeHeader from './components/HomeHeader.vue';
import BookmarkList from './components/BookmarkList.vue';
import { computed, ref } from 'vue';

import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const parentId = computed(() => appStore.parentId);

const HomeHeaderBottomBorder = ref(false);

const handleBookmarkListScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  HomeHeaderBottomBorder.value = target.scrollTop > 0;
};
</script>

<style scoped lang="scss">
.AppMain {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  .HomeHeader {
    flex: 0 0;
    touch-action: none;
    position: relative;
    z-index: 2;
  }
  .BookmarkList {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    z-index: 1;
  }
}
</style>