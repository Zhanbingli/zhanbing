---
title: '使用 Next.js 搭建静态博客的完整指南'
date: '2025-05-25'
excerpt: '详细介绍如何使用 Next.js、TypeScript 和 Tailwind CSS 搭建一个现代化的静态博客网站。'
tags: ['Next.js', 'TypeScript', 'Tailwind CSS', '静态网站', '教程']
---

# 使用 Next.js 搭建静态博客的完整指南

在这篇文章中，我将分享如何使用 Next.js 搭建一个现代化的静态博客网站。

## 为什么选择 Next.js？

Next.js 是一个优秀的 React 框架，特别适合构建静态博客：

### 优势

- **静态生成 (SSG)** - 在构建时生成静态 HTML，加载速度极快
- **SEO 友好** - 服务端渲染支持，搜索引擎优化效果好
- **开发体验** - 热重载、TypeScript 支持、自动代码分割
- **部署简单** - 可以部署到任何静态托管服务

## 技术栈

我们的博客使用以下技术栈：

```bash
- Next.js 15 (React 框架)
- TypeScript (类型安全)
- Tailwind CSS (样式框架)
- Gray Matter (Markdown 元数据解析)
- Remark (Markdown 处理)
```

## 项目结构

```
my_blog/
├── posts/                 # Markdown 文章
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # React 组件
│   └── lib/              # 工具函数
├── public/               # 静态资源
└── package.json
```

## 核心功能实现

### 1. Markdown 文章处理

我们使用 `gray-matter` 解析 Markdown 文件的元数据：

```typescript
import matter from 'gray-matter'

const matterResult = matter(fileContents)
// 获取文章标题、日期等元数据
const { title, date, excerpt } = matterResult.data
```

### 2. 静态路由生成

Next.js 的 `generateStaticParams` 函数可以在构建时生成所有文章页面：

```typescript
export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}
```

### 3. 响应式设计

使用 Tailwind CSS 实现响应式布局：

```jsx
<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
  <article className="prose prose-lg max-w-none">
    {/* 文章内容 */}
  </article>
</div>
```

## 部署到自定义域名

### 1. 配置静态导出

在 `next.config.js` 中启用静态导出：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### 2. 构建和部署

```bash
npm run build
```

生成的静态文件在 `out` 目录中，可以部署到：

- **GitHub Pages** - 免费，支持自定义域名
- **Vercel** - 零配置部署，性能优秀
- **Netlify** - 简单易用，功能丰富
- **自己的服务器** - 完全控制

### 3. 自定义域名配置

1. 在域名提供商处添加 CNAME 记录
2. 在部署平台配置自定义域名
3. 启用 HTTPS（大多数平台自动提供）

## 性能优化

- **图片优化** - 使用 Next.js Image 组件
- **代码分割** - 自动按页面分割代码
- **预加载** - 链接预加载提升用户体验
- **压缩** - 自动压缩 CSS 和 JavaScript

## 总结

使用 Next.js 搭建静态博客是一个很好的选择，它提供了现代化的开发体验和优秀的性能。通过合理的项目结构和配置，我们可以快速搭建一个功能完整、SEO 友好的博客网站。

下一篇文章我将分享如何为博客添加评论系统和搜索功能，敬请期待！ 