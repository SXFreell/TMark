<template>
  <div>
    <button @click="() => {
      $router.back();
    }">返回上一页</button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DevIndex'
})
</script>