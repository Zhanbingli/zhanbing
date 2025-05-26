# 图片资源组织结构

## 目录说明

```
public/images/
├── posts/              # 博客文章相关图片
│   ├── article-name/   # 按文章名称分组
│   │   ├── cover.jpg   # 封面图
│   │   ├── demo-1.png  # 演示图片1
│   │   └── demo-2.gif  # 演示图片2
│   └── common/         # 通用图片
├── avatars/            # 头像图片
├── icons/              # 图标文件
└── backgrounds/        # 背景图片
```

## 图片命名规范

- 使用小写字母和连字符
- 避免中文和特殊字符
- 描述性命名，如：`nextjs-blog-setup-cover.jpg`
- 为动图使用 `.gif` 扩展名
- 为截图使用 `.png` 扩展名
- 为照片使用 `.jpg` 扩展名

## 图片优化建议

- 压缩图片以减小文件大小
- 使用合适的格式（WebP > JPEG > PNG）
- 控制图片尺寸，通常不超过 1200px 宽度
- 为图片添加 alt 属性以提高可访问性 