import type { PostData } from '@/lib/posts'
import { detectContentLanguage } from '@/lib/utils'

export type WritingTrackId =
  | 'ai-tools'
  | 'learning-by-building'
  | 'medical-systems'
  | 'writing-action'

export interface WritingTrack {
  id: WritingTrackId
  title: string
  shortTitle: string
  eyebrow: string
  description: string
  thesis: string
  accent: string
  slugs: string[]
  tags: string[]
}

export interface ReadingPath {
  id: string
  title: string
  description: string
  postSlugs: string[]
}

export interface ActiveProject {
  title: string
  status: string
  description: string
  trackId: WritingTrackId
  postSlugs: string[]
}

export const writingTracks: WritingTrack[] = [
  {
    id: 'ai-tools',
    title: 'AI as a Working Tool',
    shortTitle: 'AI Tools',
    eyebrow: 'Tools and agency',
    description:
      'How LLMs, coding agents, and AI products change the way ideas become working systems.',
    thesis:
      'AI is not just a topic here; it is the practical lever that turns uncertainty into experiments.',
    accent: 'teal',
    slugs: [
      '2026-4-18',
      'ai-tools-use',
      'action-vs-thinking',
      'how-use-chatgpt-plus',
      'research-about-learn',
      'ai-tools-misguidance',
      'conversations-with-gpt',
      'daily-life-with-gpt',
      'english-ai-tools-information-channel',
      'future-role-of-brain',
      'gpt-sentences',
      'vibe-coding-app-lessons',
    ],
    tags: ['AI', 'thinking', 'personal growth'],
  },
  {
    id: 'learning-by-building',
    title: 'Learning by Building',
    shortTitle: 'Building',
    eyebrow: 'Practice over theory',
    description:
      'Posts about learning programming, building projects, and turning vague interest into concrete output.',
    thesis:
      'The recurring pattern is simple: build first, then use the friction to discover what must be learned.',
    accent: 'indigo',
    slugs: [
      'blog-buit-thinking',
      'contribute-project-first',
      'r-learning-base',
      'nextjs-blog-setup',
      'how-to-add-images',
      'hello-world',
      'learn-to-learn',
      'learn_way',
      'how-to-learn',
      'The-Art-of-Scaling',
      'learning-computers-seriously',
      'learning-action-invisible-barrier',
      'production-over-consumption',
      'windows-cloud-server-deploy',
    ],
    tags: ['learning', 'learn', 'open source', 'Python', 'React', 'Next.js'],
  },
  {
    id: 'medical-systems',
    title: 'Medical Knowledge Systems',
    shortTitle: 'Medicine',
    eyebrow: 'Medicine plus tools',
    description:
      'Experiments that connect clinical learning, literature workflows, local models, and physical systems.',
    thesis:
      'The medical thread is about making knowledge usable: searchable, testable, and close to real work.',
    accent: 'amber',
    slugs: ['2026-4-23', 'qwen_learn', 'esp_recorde', 'medical-tb', 'growth-choice-market-medical-student'],
    tags: ['medical', 'research', 'learning'],
  },
  {
    id: 'writing-action',
    title: 'Writing, Action, and Self Direction',
    shortTitle: 'Action',
    eyebrow: 'Personal operating system',
    description:
      'Essays on writing, attention, choices, markets, motivation, and the discipline of finishing things.',
    thesis:
      'Writing is the method for making thought visible, and action is the test that keeps thought honest.',
    accent: 'rose',
    slugs: [
      'read-and-write',
      'plan_vs_action',
      'skill_and_konwlage',
      'slect-more',
      'my-freelancer',
      'just-to-do',
      'life-thinking-about-market',
      'i-like-reading',
      'my-first-blog',
      'asking-better-questions',
      'cognitive-differences',
      'just-be-yourself',
      'leaving-a-shares',
      'liang-yongan-gap-year',
      'personal-career-development',
      'pursuit-of-realness',
      'reading-and-writing-questions',
      'scarcity-growth-shackles',
      'thinking-writing-reading-learning',
      'why-i-still-write-myself',
      'why-paying-is-a-bargain',
      'why-read-books',
    ],
    tags: ['thinking', '思考', '个人成长', '博客', '开始'],
  },
]

export const sourceTags = ['微信公众号']

export const fallbackTrack = writingTracks.find((track) => track.id === 'writing-action')!

export const featuredPostSlugs = [
  '2026-4-23',
  '2026-4-18',
  'blog-buit-thinking',
  'action-vs-thinking',
]

export const readingPaths: ReadingPath[] = [
  {
    id: 'why-this-site-exists',
    title: 'Why this site exists',
    description:
      'Start with the pieces that explain why writing, building, and public notes became the operating system for this site.',
    postSlugs: ['read-and-write', 'blog-buit-thinking', '2026-4-23'],
  },
  {
    id: 'ai-to-action',
    title: 'From AI tools to action',
    description:
      'Read this path if you want the core argument: AI matters most when it reduces the distance between an idea and a working attempt.',
    postSlugs: ['action-vs-thinking', 'ai-tools-use', '2026-4-18'],
  },
  {
    id: 'learning-loop',
    title: 'The learning loop',
    description:
      'A route through the recurring lesson that skill grows through doing, feedback, and friction rather than passive consumption.',
    postSlugs: ['how-to-learn', 'learn_way', 'contribute-project-first', 'r-learning-base'],
  },
  {
    id: 'medicine-and-systems',
    title: 'Medicine as a knowledge system',
    description:
      'The medical thread: literature, local knowledge bases, clinical standards, and the attempt to make knowledge usable.',
    postSlugs: ['qwen_learn', 'medical-tb', 'esp_recorde', '2026-4-23'],
  },
]

export const activeProjects: ActiveProject[] = [
  {
    title: 'Personal medical knowledge base',
    status: 'Building',
    description:
      'A workflow for turning textbooks, papers, and AI-generated summaries into a searchable local knowledge base.',
    trackId: 'medical-systems',
    postSlugs: ['2026-4-23', 'qwen_learn'],
  },
  {
    title: 'OpenCode as a personal assistant',
    status: 'Iterating',
    description:
      'Customizing coding agents so they can work with Zotero, Obsidian, PDFs, and medical reading workflows.',
    trackId: 'ai-tools',
    postSlugs: ['2026-4-18', '2026-4-23'],
  },
  {
    title: 'Learning TypeScript through real tools',
    status: 'Learning',
    description:
      'Understanding modern AI applications by reading and modifying TypeScript-heavy agent projects.',
    trackId: 'learning-by-building',
    postSlugs: ['2026-4-18', 'blog-buit-thinking'],
  },
  {
    title: 'Writing as a thinking system',
    status: 'Ongoing',
    description:
      'Using public notes to make scattered decisions, anxieties, and experiments visible enough to improve.',
    trackId: 'writing-action',
    postSlugs: ['read-and-write', 'plan_vs_action', 'skill_and_konwlage'],
  },
]

export function getTrackById(trackId: WritingTrackId): WritingTrack {
  return writingTracks.find((track) => track.id === trackId) ?? fallbackTrack
}

function isWritingTrackId(value: string | undefined): value is WritingTrackId {
  return Boolean(value && writingTracks.some((track) => track.id === value))
}

export function getPostTrack(post: Pick<PostData, 'id' | 'tags' | 'title' | 'track'>): WritingTrack {
  if (isWritingTrackId(post.track)) {
    return getTrackById(post.track)
  }

  const explicit = writingTracks.find((track) => track.slugs.includes(post.id))
  if (explicit) return explicit

  const normalizedTags = new Set((post.tags ?? []).map((tag) => tag.toLowerCase()))
  const scored = writingTracks
    .map((track) => {
      const score = track.tags.reduce(
        (total, tag) => total + (normalizedTags.has(tag.toLowerCase()) ? 1 : 0),
        0
      )
      return { track, score }
    })
    .sort((a, b) => b.score - a.score)

  return scored[0]?.score > 0 ? scored[0].track : fallbackTrack
}

export function groupPostsByTrack(posts: PostData[]) {
  return writingTracks.map((track) => ({
    track,
    posts: posts.filter((post) => getPostTrack(post).id === track.id),
  }))
}

export function getFeaturedPosts(posts: PostData[]) {
  const frontmatterFeatured = posts.filter((post) => post.featured)
  if (frontmatterFeatured.length > 0) {
    return frontmatterFeatured
  }

  return featuredPostSlugs
    .map((slug) => posts.find((post) => post.id === slug))
    .filter((post): post is PostData => Boolean(post))
}

export function getPostsBySlugs(posts: PostData[], slugs: string[]) {
  return slugs
    .map((slug) => posts.find((post) => post.id === slug))
    .filter((post): post is PostData => Boolean(post))
}

export function getDisplayTags(tags: string[] | undefined) {
  return (tags ?? []).filter((tag) => !sourceTags.includes(tag))
}

export function getLanguageSummary(posts: PostData[]) {
  return posts.reduce(
    (summary, post) => {
      const language = post.language ?? detectContentLanguage(`${post.title} ${post.excerpt ?? ''} ${post.content}`)
      if (language === 'zh-CN') {
        summary.zh += 1
      } else {
        summary.en += 1
      }
      return summary
    },
    { zh: 0, en: 0 }
  )
}

export function getTrackClass(track: WritingTrack, surface: 'text' | 'bg' | 'border' | 'soft') {
  const classes = {
    teal: {
      text: 'text-teal-700',
      bg: 'bg-teal-700',
      border: 'border-teal-200',
      soft: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    indigo: {
      text: 'text-indigo-700',
      bg: 'bg-indigo-700',
      border: 'border-indigo-200',
      soft: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
    amber: {
      text: 'text-amber-700',
      bg: 'bg-amber-600',
      border: 'border-amber-200',
      soft: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    rose: {
      text: 'text-rose-700',
      bg: 'bg-rose-700',
      border: 'border-rose-200',
      soft: 'bg-rose-50 text-rose-800 border-rose-200',
    },
  } as const

  return classes[track.accent as keyof typeof classes]?.[surface] ?? classes.teal[surface]
}
