import type { Bookmark } from '@/api/interface';
import { generateBookmarkId } from '@/utils/bookmarks';
import { dbOperations } from '@/utils/indexedDB';

// 获取某个文件夹下的所有内容
async function getBookmarksByParentId(parentId: string): Promise<Bookmark[]> {
  const bookmarks = await dbOperations.getByIndex('bookmarks', 'parentId', parentId);
  return bookmarks as Bookmark[];
}

// 创建文件夹
async function createFolder(name: string, parentId: string): Promise<Bookmark> {
  const timeNow = new Date();
  const id = generateBookmarkId(timeNow.getTime());
  const createdAt = timeNow.toISOString();
  const dir: Bookmark = {
    id,
    name,
    type: 'folder',
    parentId,
    createdAt,
    updatedAt: createdAt
  };
  
  await dbOperations.add('bookmarks', dir);
  return dir;
}

// 创建书签项
async function createBookmark(name: string, url: string, parentId: string): Promise<Bookmark> {
  const timeNow = new Date();
  const id = generateBookmarkId(timeNow.getTime());
  const createdAt = timeNow.toISOString();
  const item: Bookmark = {
    id,
    name,
    type: 'bookmark',
    url,
    parentId,
    createdAt,
    updatedAt: createdAt
  };
  
  await dbOperations.add('bookmarks', item);
  return item;
}

// 获取文件夹名称
async function getFolderById(id: string): Promise<Bookmark> {
  return await dbOperations.get('bookmarks', id) as Bookmark;
}

// 删除书签项
const deleteIds: string[] = [];
async function deleteBookmark(id: string, isLoop: boolean = true): Promise<void> {
  // 如果是文件夹,需要递归收集所有要删除的 ID
  const bookmark = await dbOperations.get('bookmarks', id) as Bookmark;
  if (bookmark.type === 'folder') {
    const children = await getBookmarksByParentId(id);
    await Promise.all(children.map(child => deleteBookmark(child.id, false)));
  }
  deleteIds.push(id);
  
  // 批量删除收集到的 ID
  if (isLoop) {
    await Promise.all(deleteIds.map(id => dbOperations.delete('bookmarks', id)));
    deleteIds.length = 0; // 清空数组
  }
}

export { 
    getBookmarksByParentId,
    createFolder,
    createBookmark,
    getFolderById,
    deleteBookmark
};
