import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  const parentIdList = ref(['0']);
  const setParentId = (id: string) => {
    parentIdList.value.push(id);
  };
  const popParentId = () => {
    if (parentIdList.value.length === 1) {
      return;
    }
    return parentIdList.value.pop();
  };
  const clearParentId = () => {
    parentIdList.value = ['0'];
  };
  const parentId = computed(() => parentIdList.value[parentIdList.value.length - 1]);

  return { parentId, setParentId, popParentId, clearParentId }
})
