# 博客图片使用快速指南

## 🚀 快速开始

### 1. 为新文章创建图片目录
```bash
./scripts/image-helper.sh create-dir 文章名称
```

### 2. 在文章中引用图片
```markdown
![图片描述](/images/posts/文章名称/图片文件名.jpg)
```

## 📁 目录结构

```
public/images/
├── posts/                    # 文章图片
│   ├── common/              # 通用图片
│   ├── nextjs-blog-setup/   # 按文章分组
│   └── how-to-add-images/   
├── avatars/                 # 头像
├── icons/                   # 图标
└── backgrounds/             # 背景图
```

## 💡 常用语法

### 基础图片
```markdown
![Alt 文本](/images/posts/article/image.jpg)
```

### 带链接的图片
```markdown
[![Alt 文本](/images/posts/article/image.jpg)](链接地址)
```

### 响应式图片 (HTML)
```html
<img src="/images/posts/article/image.jpg" 
     alt="描述" 
     style="width: 100%; max-width: 600px;" />
```

### 图片并排显示
```html
<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="/images/posts/article/before.jpg" alt="优化前" style="width: 48%;" />
  <img src="/images/posts/article/after.jpg" alt="优化后" style="width: 48%;" />
</div>
```

## 🎯 最佳实践

### 文件命名
- ✅ `nextjs-setup-demo.jpg`
- ✅ `project-structure.png`
- ❌ `IMG_001.jpg`
- ❌ `截图1.png`

### 文件大小
- 网页图片: < 100KB
- 高质量图片: < 500KB
- 动图: < 1MB

### 尺寸建议
- 封面图: 1200×630px
- 内容图片: 最大宽度 800px
- 缩略图: 300×200px

### Alt 文本示例
```markdown
![Next.js 项目初始化命令行界面截图](/images/posts/setup/init-command.png)
```

## 🛠️ 实用工具

### 管理脚本命令
```bash
# 列出所有图片目录
./scripts/image-helper.sh list-dirs

# 检查缺失图片
./scripts/image-helper.sh check-missing

# 显示统计信息
./scripts/image-helper.sh stats

# 优化图片
./scripts/image-helper.sh optimize path/to/image.jpg
```

### 图片压缩工具
- **在线**: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)
- **软件**: Photoshop, GIMP
- **命令行**: ImageMagick

## 📝 示例文章

参考 `posts/how-to-add-images.md` 查看完整示例。

## ⚠️ 注意事项

1. **路径必须以 `/` 开头**: `/images/posts/...`
2. **文件名不要有中文和空格**
3. **测试图片是否能正常显示**
4. **记得添加有意义的 alt 文本**
5. **图片文件要放在正确的目录下**

## 🔧 故障排除

### 图片不显示？
1. 检查文件路径是否正确
2. 确认图片文件存在
3. 检查文件名大小写
4. 清除浏览器缓存

### 图片太大？
```bash
# 使用脚本优化
./scripts/image-helper.sh optimize public/images/posts/article/image.jpg

# 或手动压缩后重新上传
``` 