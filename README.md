# TMark - 网页书签管理工具

TMark 是一个基于 Vue 3 和 IndexedDB 的网页书签管理工具，旨在为用户提供一个简洁、高效的书签管理体验。

## 功能特性

- 📁 多层级文件夹管理
- 🔖 书签添加与编辑
- 🔄 实时同步与更新
- 📱 移动端优化
- 🌙 主题颜色自定义
- 🛠️ PWA 支持

## 技术栈

- **前端框架**: Vue 3
- **UI 组件库**: Arco Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router
- **数据库**: IndexedDB
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── assets/ # 静态资源
├── components/ # 公共组件
├── views/ # 页面视图
├── router/ # 路由配置
├── utils/ # 工具函数
├── api/ # API 接口
├── hooks/ # 自定义 hooks
├── App.vue # 根组件
└── main.ts # 入口文件
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 生产构建

```bash
pnpm build
```

### 代码检查
```bash
pnpm lint
```

### 代码格式化
```bash
pnpm format
```

## 浏览器支持

- Chrome 最新版
- Firefox 最新版
- Edge 最新版
- Safari 最新版

## 贡献指南

欢迎提交 Issue 和 PR，贡献代码前请确保：

1. 代码风格符合项目规范
2. 通过所有测试
3. 更新相关文档

## 许可证