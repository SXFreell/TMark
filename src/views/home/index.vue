<template>
  <div class="AppMain">
    <HomeHeader class="HomeHeader" />
    <BookmarkList class="BookmarkList" />
  </div>

</template>

<script setup lang="ts">
import HomeHeader from './components/HomeHeader.vue';
import BookmarkList from './components/BookmarkList.vue';
import { ref } from 'vue';

const bookmarksJsonString = localStorage.getItem('bookmarks') || '[]';
const bookmarks = ref(JSON.parse(bookmarksJsonString));

</script>

<style scoped lang="scss">
.AppMain {
  display: flex;
  flex-direction: column;
  height: 100%;
  .HomeHeader {
    flex: 0 0;
  }
  .BookmarkList {
    flex: 1;
  }
}
</style>