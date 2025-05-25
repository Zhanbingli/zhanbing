# 部署指南

本文档详细介绍如何将你的博客部署到各种平台，并配置自定义域名。

## 🚀 部署选项

### 1. GitHub Pages（推荐）

GitHub Pages 是免费的静态网站托管服务，非常适合个人博客。

#### 自动部署设置

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial blog setup"
   git push origin main
   ```

2. **启用 GitHub Actions**
   - 项目已包含 `.github/workflows/deploy.yml` 配置
   - 推送代码后会自动触发构建和部署

3. **配置 GitHub Pages**
   - 进入仓库设置 → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "gh-pages"
   - 点击 Save

4. **自定义域名（可选）**
   - 在域名提供商添加 CNAME 记录：`www.yourdomain.com` → `yourusername.github.io`
   - 在 `.github/workflows/deploy.yml` 中修改 `cname` 字段
   - 在 GitHub Pages 设置中添加自定义域名

### 2. Vercel

Vercel 提供优秀的性能和零配置部署。

#### 部署步骤

1. **连接 GitHub**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 导入你的博客仓库

2. **配置项目**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `out`

3. **自定义域名**
   - 在 Vercel 项目设置中添加域名
   - 配置 DNS 记录指向 Vercel

### 3. Netlify

Netlify 提供简单的拖拽部署和强大的功能。

#### 方法一：拖拽部署

1. 构建项目：`npm run build`
2. 将 `out` 目录拖拽到 [netlify.com/drop](https://netlify.com/drop)

#### 方法二：Git 集成

1. 连接 GitHub 仓库到 Netlify
2. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `out`

### 4. 自己的服务器

如果你有自己的服务器，可以直接部署静态文件。

#### 部署步骤

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传文件**
   ```bash
   # 使用 rsync 上传
   rsync -avz out/ user@yourserver.com:/var/www/html/
   
   # 或使用 scp
   scp -r out/* user@yourserver.com:/var/www/html/
   ```

3. **配置 Web 服务器**
   
   **Nginx 配置示例：**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ $uri.html =404;
       }
       
       # 启用 gzip 压缩
       gzip on;
       gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   }
   ```

## 🌐 自定义域名配置

### 购买域名

推荐的域名注册商：
- [Namecheap](https://www.namecheap.com)
- [GoDaddy](https://www.godaddy.com)
- [阿里云](https://wanwang.aliyun.com)
- [腾讯云](https://dnspod.cloud.tencent.com)

### DNS 配置

#### GitHub Pages
```
类型: CNAME
名称: www
值: yourusername.github.io
```

#### Vercel
```
类型: CNAME
名称: www
值: cname.vercel-dns.com
```

#### Netlify
```
类型: CNAME
名称: www
值: your-site-name.netlify.app
```

### HTTPS 配置

大多数现代托管平台都会自动提供 SSL 证书：
- GitHub Pages: 自动提供
- Vercel: 自动提供
- Netlify: 自动提供

## 📊 性能优化

### 1. 图片优化

```bash
# 安装图片优化工具
npm install next-optimized-images imagemin-webp
```

### 2. 启用压缩

在 `next.config.ts` 中添加：
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  compress: true,
  // ... 其他配置
}
```

### 3. CDN 配置

使用 CDN 加速静态资源：
- Cloudflare（免费）
- AWS CloudFront
- 阿里云 CDN

## 🔧 持续集成/持续部署 (CI/CD)

### GitHub Actions（已配置）

项目已包含自动部署配置，每次推送到 main 分支都会自动构建和部署。

### 自定义构建脚本

创建 `scripts/deploy.sh`：
```bash
#!/bin/bash
echo "开始构建..."
npm run build

echo "部署到服务器..."
rsync -avz --delete out/ user@yourserver.com:/var/www/html/

echo "部署完成！"
```

## 📈 监控和分析

### Google Analytics

在 `src/app/layout.tsx` 中添加：
```typescript
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 其他分析工具

- [Vercel Analytics](https://vercel.com/analytics)
- [Netlify Analytics](https://www.netlify.com/products/analytics/)
- [Cloudflare Analytics](https://www.cloudflare.com/analytics/)

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本（推荐 18+）
   - 清除缓存：`rm -rf .next node_modules && npm install`

2. **页面 404**
   - 确保文件路径正确
   - 检查 `next.config.ts` 中的 `trailingSlash` 设置

3. **样式不显示**
   - 检查 Tailwind CSS 配置
   - 确保 `globals.css` 正确导入

### 调试技巧

```bash
# 本地测试构建结果
npm run build
npx serve out

# 检查构建输出
npm run build -- --debug
```

## 📞 获取帮助

如果遇到问题，可以：
1. 查看项目的 Issues
2. 阅读相关平台的文档
3. 在社区论坛寻求帮助

---

祝你部署顺利！🎉 