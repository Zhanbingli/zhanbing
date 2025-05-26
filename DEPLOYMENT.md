# 🚀 博客部署指南

## 📋 概述

您的博客现在是一个纯静态网站，完全适合部署到 GitHub Pages。已移除所有服务器端功能，包括：

- ❌ 邮件订阅功能
- ❌ API 路由
- ❌ 数据库依赖

现在只保留核心功能：
- ✅ 文章展示
- ✅ 标签系统  
- ✅ 搜索功能（客户端）
- ✅ RSS 订阅
- ✅ 响应式设计
- ✅ 美观的404页面

## 🏗️ 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

#### 1. 推送代码到GitHub
```bash
git add .
git commit -m "移除邮件订阅功能，优化为静态部署"
git push origin main
```

#### 2. 创建GitHub Actions工作流
创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Blog to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 3. 配置 GitHub Pages
1. 进入你的 GitHub 仓库
2. 点击 **Settings** 
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 中选择 **GitHub Actions**

### 方法二：手动部署

#### 1. 配置静态导出
更新 `next.config.js`：

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

#### 2. 构建和部署
```bash
# 构建静态文件
npm run build

# 推送 out 目录到 gh-pages 分支
npx gh-pages -d out
```

## 🔧 优化配置

### 更新 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 如果部署在子目录，设置 basePath
  // basePath: '/repository-name',
  // assetPrefix: '/repository-name/',
}

module.exports = nextConfig
```

### 添加 .nojekyll 文件
在 `public/.nojekyll` 创建空文件，防止 Jekyll 处理：

```bash
touch public/.nojekyll
```

## 📝 部署后的功能

### ✅ 可用功能
- **文章浏览** - 所有文章正常展示
- **标签导航** - 按标签筛选文章
- **搜索功能** - 客户端搜索（无需服务器）
- **RSS订阅** - 静态 RSS 文件
- **响应式布局** - 移动端友好
- **SEO优化** - 完整的元数据

### ❌ 不可用功能
- **邮件订阅** - 已移除
- **服务器端功能** - GitHub Pages 不支持

## 🌐 访问地址

部署完成后，您的博客将在以下地址可用：
- 主域名：`https://yourusername.github.io/repository-name`
- 自定义域名：可在 GitHub Pages 设置中配置

## 🔄 更新流程

每次更新博客内容：
1. 编辑 `posts/` 目录下的 Markdown 文件
2. 提交并推送到 GitHub
3. GitHub Actions 自动构建和部署

## 📊 性能优化

您的博客现在是纯静态网站，具有以下优势：
- ⚡ **极快加载** - 无服务器延迟
- 💰 **免费托管** - GitHub Pages 免费
- 🔒 **高可用** - GitHub 的可靠性
- 🌍 **全球CDN** - 自动分发

## 🎯 进一步优化建议

1. **自定义域名**：在 GitHub Pages 设置中添加
2. **SSL证书**：GitHub Pages 自动提供
3. **SEO优化**：已包含 sitemap 和 robots.txt
4. **图片优化**：压缩 `public/images/` 中的图片

## ⚠️ 注意事项

1. **静态限制**：无法处理表单提交或用户交互
2. **搜索功能**：基于客户端，数据量大时可能影响性能
3. **更新延迟**：GitHub Actions 通常需要1-2分钟

## 🆘 常见问题

### Q: 部署后404页面不显示？
A: 确保创建了 `src/app/not-found.tsx` 文件

### Q: 图片不显示？
A: 检查图片路径，确保在 `public/` 目录下

### Q: 样式错乱？
A: 可能是路径问题，检查 `next.config.js` 中的 `basePath` 配置

恭喜！您的博客现在完全适合静态部署了！🎉 