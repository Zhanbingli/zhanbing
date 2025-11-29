# Zhanbing’s personal blog

A modern static blog built with Next.js. Markdown-powered, responsive, and tuned for SEO.

🌐 **Live site**: [https://zhanbing.site](https://zhanbing.site)

## Blog links

- **Current blog (Next.js)**: https://zhanbing.site (this project)
- **Previous blog (MkDocs)**: https://zhanbingli.github.io/ (still available)

## Positioning

### New blog (zhanbing.site)
- Focused on in-depth technical articles and project highlights
- Modern design and better reading experience
- Markdown writing with static generation

### Legacy blog (zhanbingli.github.io)
- Keeps existing tech posts, life notes, and English study entries
- Continues as a knowledge base and docs site

## Features

- 📝 **Markdown** writing
- 🎨 **Modern design** with Tailwind CSS
- ⚡ **Static generation** for fast loads
- 🔍 **SEO ready** metadata and Open Graph
- 📱 **Responsive** layouts
- 🏷️ **Tags** for categorization
- 📅 **Date formatting** via date-fns

## Getting started

### 1) Install dependencies
```bash
npm install
```

### 2) Start dev server
```bash
npm run dev
```
Visit http://localhost:3000 to view the blog.

## Writing workflow

### Option 1: helper scripts (recommended)

#### Create a new post
```bash
npm run new
# or
./scripts/new-post.sh
```
The script prompts for title, excerpt, and tags, then scaffolds the file.

#### Publish posts
```bash
npm run publish
# or
./scripts/publish.sh
```
Commits changes and pushes to GitHub to trigger deployment.

### Option 2: manual

#### 1. Create a post
Add a `.md` file under `posts/`:

```markdown
---
title: 'Post title'
date: '2024-01-15'
excerpt: 'Short summary'
tags: ['tag-1', 'tag-2']
---

# Content

Write your post here...
```

#### 2. Preview locally
```bash
npm run dev
```

#### 3. Publish to the site
```bash
git add .
git commit -m "Add new blog post: Post title"
git push
```

## Project structure

```
my_blog/
├── posts/                 # Markdown posts
├── scripts/               # Helper scripts
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── posts/[id]/    # Post detail pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home
│   │   └── globals.css    # Global styles
│   ├── components/        # React components
│   └── lib/               # Utilities
│       ├── posts.ts
│       └── utils.ts
├── public/                # Static assets
└── package.json
```

## Stack

- **Next.js 15** (React)
- **TypeScript**
- **Tailwind CSS** + **Tailwind Typography**
- **Gray Matter** / **Remark** for Markdown
- **date-fns** for dates

## Commands

```bash
# Development
npm run dev

# Create a post
npm run new

# Publish (scripted)
npm run publish

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Preview the build locally
npm run preview
```

## Deployment

GitHub Actions deploys to GitHub Pages:

1. Push to `main`
2. Actions builds automatically
3. The site deploys to https://zhanbing.site

Builds usually finish within a few minutes.

## Writing tips

### File names
- Use descriptive names like `react-hooks-guide.md`
- Avoid non-ASCII file names
- Separate words with hyphens

### Tags
- Keep tags concise and consistent
- Examples: `tech`, `tutorial`, `React`, `JavaScript`, `life`

### Images
- Place images in `public/images/`
- Reference them with relative paths: `![alt text](/images/example.jpg)`

## Contributing

Issues and PRs are welcome!

## License

MIT License

---

If this blog helps you, consider leaving a ⭐ star!

## Links

- **New blog**: https://zhanbing.site
- **Legacy blog**: https://zhanbingli.github.io/
- **GitHub repo**: https://github.com/Zhanbingli/zhanbing
- **Deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **DNS setup**: [DNS_SETUP.md](./DNS_SETUP.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Contact

- **GitHub**: [@Zhanbingli](https://github.com/Zhanbingli)
- **Blog**: https://zhanbing.site

---

Note: The MkDocs blog (zhanbingli.github.io) remains available alongside this Next.js version.
