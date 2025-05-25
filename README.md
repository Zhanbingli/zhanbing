# 我的个人博客

这是一个使用 Next.js 构建的现代化静态博客，支持 Markdown 写作，具有响应式设计和 SEO 优化。

## 特性

- 📝 **Markdown 支持** - 使用 Markdown 格式写作文章
- 🎨 **现代化设计** - 使用 Tailwind CSS 构建的响应式界面
- ⚡ **静态生成** - 构建时生成静态 HTML，加载速度极快
- 🔍 **SEO 友好** - 完整的元数据和 Open Graph 支持
- 📱 **移动端优化** - 完美适配各种设备
- 🏷️ **标签系统** - 支持文章标签分类
- 📅 **日期格式化** - 中文日期显示

## 技术栈

- **Next.js 15** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Tailwind Typography** - 文章内容样式
- **Gray Matter** - Markdown 元数据解析
- **Remark** - Markdown 处理
- **Date-fns** - 日期处理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

### 3. 写作文章

在 `posts` 目录下创建 `.md` 文件，格式如下：

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

## 项目结构

```
my_blog/
├── posts/                 # Markdown 文章目录
│   ├── hello-world.md
│   └── nextjs-blog-setup.md
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

## 部署

### 构建静态文件

```bash
npm run build
```

构建完成后，静态文件将生成在 `out` 目录中。

### 部署选项

#### 1. GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择从 `gh-pages` 分支部署
4. 配置自定义域名（可选）

#### 2. Vercel

1. 连接 GitHub 仓库到 Vercel
2. Vercel 会自动检测 Next.js 项目
3. 配置自定义域名
4. 每次推送代码会自动部署

#### 3. Netlify

1. 将 `out` 目录拖拽到 Netlify
2. 或连接 GitHub 仓库自动部署
3. 配置自定义域名

#### 4. 自己的服务器

将 `out` 目录中的文件上传到你的 Web 服务器即可。

### 自定义域名配置

1. **购买域名** - 从域名注册商购买域名
2. **DNS 配置** - 添加 CNAME 记录指向部署平台
3. **HTTPS** - 大多数平台会自动提供 SSL 证书

## 自定义配置

### 修改博客信息

编辑以下文件来自定义博客：

- `src/app/layout.tsx` - 网站标题、描述等元数据
- `src/app/page.tsx` - 首页标题和介绍
- `posts/` - 添加你的文章

### 样式自定义

- `src/app/globals.css` - 全局样式
- 使用 Tailwind CSS 类名自定义组件样式

### 添加新功能

- 评论系统（如 Giscus、Disqus）
- 搜索功能
- RSS 订阅
- 访问统计

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器（需要先构建）
npm start

# 代码检查
npm run lint
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

如果这个博客对你有帮助，请给个 ⭐ Star！
