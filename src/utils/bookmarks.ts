import { BookmarkItemAndDir, BookmarkDir } from "@/api/interface";

function isBookmarkDir(bookmark: BookmarkItemAndDir): bookmark is BookmarkDir {
  return (bookmark as BookmarkDir).bookmarks !== undefined;
}

export default class Bookmarks {
  private bookmarks: BookmarkDir;
  private bookmarksMap: Map<string, BookmarkItemAndDir>;

  constructor(bookmarksJsonString: string) {
    this.bookmarksMap = new Map<string, BookmarkItemAndDir>();
    try {
      this.bookmarks = this.getBookmarksParents(
        JSON.parse(bookmarksJsonString)
      );
    } catch (error) {
      console.error("未能成功解析bookmarks字符串", error);
      this.bookmarks = {
        id: "0",
        title: "root",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        bookmarks: [],
      };
    }
  }

  // 获取全部书签
  getBookmarks() {
    return this.bookmarks;
  }

  // 设置父节点并生成书签哈希表
  getBookmarksParents(bookmarkDir: BookmarkDir): BookmarkDir {
    for (const bookmark of bookmarkDir.bookmarks) {
      if (isBookmarkDir(bookmark)) {
        this.getBookmarksParents(bookmark);
      }
      // 保存书签到哈希表
      this.bookmarksMap.set(bookmark.id, bookmark);
      // 设置父节点
      bookmark.parent = bookmarkDir;
    }
    return bookmarkDir;
  }
}