# Image asset structure

## Directory

```
public/images/
├── posts/              # Blog post images
│   ├── article-name/   # Grouped by post name
│   │   ├── cover.jpg   # Cover
│   │   ├── demo-1.png  # Example image 1
│   │   └── demo-2.gif  # Example image 2
│   └── common/         # Shared images
├── avatars/            # Avatars
├── icons/              # Icons
└── backgrounds/        # Backgrounds
```

## Naming rules

- Use lowercase letters and hyphens
- Avoid non-ASCII or special characters
- Be descriptive, e.g. `nextjs-blog-setup-cover.jpg`
- Use `.gif` for animations
- Use `.png` for screenshots
- Use `.jpg` for photos

## Optimization tips

- Compress images to keep file sizes small
- Pick the right format (WebP > JPEG > PNG)
- Keep widths under ~1200px when possible
- Always provide alt text for accessibility
