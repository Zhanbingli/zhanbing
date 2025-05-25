# 展兵的个人博客

这是一个使用 Next.js 构建的现代化静态博客，支持 Markdown 写作，具有响应式设计和 SEO 优化。

🌐 **网站地址**: [https://zhanbing.site](https://zhanbing.site)

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

- 📝 **Markdown 支持** - 使用 Markdown 格式写作文章
- 🎨 **现代化设计** - 使用 Tailwind CSS 构建的响应式界面
- ⚡ **静态生成** - 构建时生成静态 HTML，加载速度极快
- 🔍 **SEO 友好** - 完整的元数据和 Open Graph 支持
- 📱 **移动端优化** - 完美适配各种设备
- 🏷️ **标签系统** - 支持文章标签分类
- 📅 **日期格式化** - 中文日期显示

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:3000 查看博客。

## ✍️ 写作工作流程

### 方法一：使用便捷脚本（推荐）

#### 创建新文章
```bash
npm run new
# 或者
./scripts/new-post.sh
```
脚本会引导你输入文章标题、摘要和标签，自动创建文章文件。

#### 发布文章
```bash
npm run publish
# 或者
./scripts/publish.sh
```
脚本会自动提交更改并推送到 GitHub，触发自动部署。

### 方法二：手动操作

#### 1. 创建新文章
在 `posts/` 目录下创建 `.md` 文件，格式如下：

```markdown
---
title: '文章标题'
date: '2024-01-15'
excerpt: '文章摘要'
tags: ['标签1', '标签2']
---

# 文章内容

这里是文章的正文内容...
```

#### 2. 本地预览
```bash
npm run dev
```

#### 3. 发布到网站
```bash
git add .
git commit -m "Add new blog post: 文章标题"
git push
```

## 📁 项目结构

```
my_blog/
├── posts/                 # Markdown 文章目录
│   ├── hello-world.md
│   └── nextjs-blog-setup.md
├── scripts/               # 便捷脚本
│   ├── new-post.sh        # 创建新文章
│   └── publish.sh         # 发布博客
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── posts/[id]/    # 文章详情页
│   │   ├── layout.tsx     # 根布局
│   │   ├── page.tsx       # 首页
│   │   └── globals.css    # 全局样式
│   ├── components/        # React 组件
│   └── lib/              # 工具函数
│       ├── posts.ts       # 文章处理
│       └── utils.ts       # 工具函数
├── public/               # 静态资源
└── package.json
```

## 🛠️ 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Tailwind Typography** - 文章内容样式
- **Gray Matter** - Markdown 元数据解析
- **Remark** - Markdown 处理
- **Date-fns** - 日期处理

## 📦 可用命令

```bash
# 开发模式
npm run dev

# 创建新文章
npm run new

# 发布博客
npm run publish

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 本地预览构建结果
npm run preview
```

## 🚀 部署

博客使用 GitHub Actions 自动部署到 GitHub Pages：

1. **推送代码**到 main 分支
2. **GitHub Actions** 自动构建
3. **自动部署**到 https://zhanbing.site

### 部署流程
- 每次 `git push` 都会触发自动构建
- 构建完成后自动部署到网站
- 通常 2-3 分钟内完成更新

## 🎯 写作建议

### 文章命名
- 使用有意义的文件名，如：`react-hooks-guide.md`
- 避免使用中文文件名
- 使用连字符分隔单词

### 标签使用
- 保持标签简洁明了
- 使用一致的标签命名
- 常用标签：`技术`, `教程`, `React`, `JavaScript`, `生活`

### 图片使用
- 将图片放在 `public/images/` 目录
- 在文章中使用相对路径：`![描述](/images/图片名.jpg)`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

如果这个博客对你有帮助，请给个 ⭐ Star！

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
