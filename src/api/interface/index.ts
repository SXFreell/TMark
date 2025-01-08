export interface Bookmark {
  id: string;
  name: string;
  type: 'bookmark' | 'folder';
  url?: string;
  createdAt: string;
  updatedAt: string;
  parentId: string;
}