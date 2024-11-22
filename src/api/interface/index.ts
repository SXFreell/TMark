export type BookmarkItemAndDir = BookmarkItem | BookmarkDir;

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  parent?: BookmarkDir;
}

export interface BookmarkDir {
  id: string;
  title: string;
  bookmarks: BookmarkItemAndDir[];
  createdAt: string;
  updatedAt: string;
  parent?: BookmarkDir;
}
