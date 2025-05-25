# 展兵的个人博客 (Next.js 版本)

这是展兵的新版个人博客，使用 Next.js 15 + TypeScript + Tailwind CSS 构建。

## 🌐 博客地址

- **新博客 (Next.js)**：https://zhanbing.site (本项目)
- **原博客 (MkDocs)**：https://zhanbingli.github.io/ (继续保留)

## 📝 博客定位

### 新博客 (zhanbing.site)
- 专注于**技术深度文章**和**项目展示**
- 现代化的设计和更好的阅读体验
- 支持 Markdown 写作，静态生成

### 原博客 (zhanbingli.github.io)
- 保留现有的**技术博客**、**生活随笔**、**英语学习**内容
- 继续作为知识库和文档站点使用

## ✨ 特性

- 📝 Markdown 支持
- 🎨 响应式设计
- ⚡ 静态生成 (SSG)
- 🔍 SEO 友好
- 📱 移动端优化
- 🏷️ 标签系统
- 📅 中文日期格式化

## 🛠️ 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **内容**: Markdown + Gray Matter
- **部署**: GitHub Pages
- **域名**: zhanbing.site

## 📁 项目结构

```
my_blog/
├── src/
│   ├── app/                 # App Router 页面
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   └── posts/[id]/      # 文章详情页
│   ├── lib/                 # 工具函数
│   │   ├── posts.ts         # 文章处理
│   │   └── utils.ts         # 工具函数
│   └── components/          # React 组件
├── posts/                   # Markdown 文章
├── public/                  # 静态资源
├── .github/workflows/       # GitHub Actions
└── out/                     # 构建输出
```

## 📖 使用指南

### 添加新文章

1. 在 `posts/` 目录下创建 `.md` 文件
2. 添加 Front Matter 元数据：

```markdown
---
title: '文章标题'
date: '2024-01-01'
excerpt: '文章摘要'
tags: ['标签1', '标签2']
---

文章内容...
```

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build
```

### 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages，并使用自定义域名 `zhanbing.site`。

## 🔗 相关链接

- **新博客**: https://zhanbing.site
- **原博客**: https://zhanbingli.github.io/
- **GitHub 仓库**: https://github.com/Zhanbingli/zhanbing
- **部署指南**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **DNS 配置**: [DNS_SETUP.md](./DNS_SETUP.md)
- **故障排除**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📞 联系方式

- **GitHub**: [@Zhanbingli](https://github.com/Zhanbingli)
- **博客**: https://zhanbing.site

---

**注意**: 这是新版博客项目。原有的 MkDocs 博客 (zhanbingli.github.io) 将继续保留，两个博客并存运行。
