# Zhanbing Li Knowledge Site

A personal knowledge site built with Next.js, Markdown, and GitHub Pages.

Live site: https://zhanbing.site

This is not only a chronological blog. It is a working knowledge base for notes on AI tools, medical knowledge systems, learning by building, and writing as a way to think in public.

## Main Sections

- **Home**: overview, featured notes, writing tracks, and recent updates
- **Start**: guided reading paths for new readers
- **Projects**: long-running systems behind the notes
- **Archive**: all posts grouped by writing track
- **Explore**: search plus project, path, and topic entry points
- **Topics**: high-level topic navigation
- **About**: personal context and site direction

## Writing Tracks

The site is organized around four recurring tracks:

- **AI as a Working Tool**: LLMs, coding agents, and AI products as practical leverage
- **Learning by Building**: programming, open source, and project-based learning
- **Medical Knowledge Systems**: clinical learning, literature workflows, local models, and knowledge bases
- **Writing, Action, and Self Direction**: writing, attention, decisions, markets, and action

Track configuration lives in:

```text
src/lib/content-map.ts
```

## Current Projects

The project layer makes the knowledge base less like a tag cloud and more like an evolving workspace:

- Personal medical knowledge base
- OpenCode as a personal assistant
- Learning TypeScript through real tools
- Writing as a thinking system

See:

```text
src/app/projects/page.tsx
src/lib/content-map.ts
```

## Writing Workflow

Create Markdown posts under `posts/`.

Recommended frontmatter:

```markdown
---
title: 'Post title'
date: '2026-04-23'
updatedAt: '2026-04-23'
excerpt: 'Short summary of the note.'
tags: ['AI', 'learning']
track: 'ai-tools'
language: 'zh-CN'
featured: false
draft: false
---

# Content

Write the note here.
```

Supported `track` values:

```text
ai-tools
learning-by-building
medical-systems
writing-action
```

Useful fields:

- `title`: post title
- `date`: publish date
- `updatedAt`: optional update date
- `excerpt`: short summary used in lists and metadata
- `tags`: secondary index terms
- `track`: primary knowledge track
- `language`: `zh-CN` or `en-US`
- `featured`: whether to feature the post
- `draft`: hidden from production when `true`

## Development

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

Build static output:

```bash
npm run build
```

Preview production output locally:

```bash
npm run preview
```

## Commands

```bash
# Development
npm run dev

# Create a post
npm run new

# Publish with helper script
npm run publish

# Production build / static export
npm run build

# Start production server
npm start

# Lint
npm run lint

# Preview static export
npm run preview
```

## Project Structure

```text
my_blog/
├── posts/                     # Markdown notes
├── public/                    # Static assets and CNAME
├── scripts/                   # Helper scripts
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home
│   │   ├── start/             # Guided reading paths
│   │   ├── projects/          # Long-running projects
│   │   ├── posts/             # Archive and post detail pages
│   │   ├── search/            # Explore/search page
│   │   ├── tags/              # Topic/tag pages
│   │   ├── feed.xml/          # RSS feed route
│   │   ├── sitemap.ts         # Sitemap
│   │   ├── robots.ts          # Robots.txt
│   │   ├── layout.tsx         # Root metadata/layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Shared UI components
│   └── lib/
│       ├── content-map.ts     # Tracks, projects, reading paths
│       ├── posts.ts           # Markdown loading/parsing
│       └── utils.ts           # Formatting helpers
└── package.json
```

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Tailwind Typography
- Gray Matter
- Remark
- date-fns

## Deployment

The site is statically exported and deployed to GitHub Pages through GitHub Actions.

Deployment flow:

1. Push to `main`
2. GitHub Actions runs `npm ci` and `npm run build`
3. The generated `out/` directory is deployed to GitHub Pages
4. The site is served at https://zhanbing.site

The custom domain is defined in:

```text
public/CNAME
```

DNS and Pages troubleshooting:

- [DNS_SETUP.md](./DNS_SETUP.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Links

- Site: https://zhanbing.site
- Legacy blog: https://zhanbingli.github.io/
- GitHub: https://github.com/Zhanbingli
- Repository: https://github.com/Zhanbingli/zhanbing

## License

MIT
