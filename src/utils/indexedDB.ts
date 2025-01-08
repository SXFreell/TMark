const DB_NAME = 'bookmarks';
const DB_VERSION = 1;

let db: IDBDatabase;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('数据库打开失败:', event);
      reject(event);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log('数据库连接成功');
      
      // 检查并创建根文件夹
      const transaction = db.transaction('bookmarks', 'readonly');
      const store = transaction.objectStore('bookmarks');
      const countRequest = store.count();
      
      countRequest.onsuccess = async () => {
        if (countRequest.result === 0) {
          // 创建根文件夹
          const timeNow = new Date().toISOString();
          await dbOperations.add('bookmarks', {
            id: '0',
            name: '书签',
            type: 'folder',
            parentId: null,
            createdAt: timeNow,
            updatedAt: timeNow
          });
          console.log('根文件夹创建成功');
        }
      };

      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 创建书签项存储
      if (!db.objectStoreNames.contains('bookmarks')) {
        const itemStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
        itemStore.createIndex('parentId', 'parentId');
      }
    };
  });
};

// 基础的 CRUD 操作示例
export const dbOperations = {
  // 添加数据
  add: <T>(storeName: string, data: T) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  // 获取数据
  get: (storeName: string, key: string | number) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  // 通过属性值获取数据
  getByIndex: (storeName: string, indexName: string, value: string | number) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.index(indexName).getAll(value);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  // 更新数据
  update: (storeName: string, data: Record<string, unknown>) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  // 删除数据
  delete: (storeName: string, key: string | number) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  // 返回db
  getDB: () => db
}; 