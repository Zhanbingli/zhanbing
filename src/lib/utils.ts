import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'yyyy年MM月dd日', { locale: zhCN })
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MM.dd', { locale: zhCN })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function detectContentLanguage(text: string): 'zh-CN' | 'en-US' {
  const cjkCount = (text.match(/[\u3400-\u9fff]/g) || []).length
  const latinWords = (text.match(/\b[a-zA-Z][a-zA-Z'-]*\b/g) || []).length
  return cjkCount >= latinWords ? 'zh-CN' : 'en-US'
}

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
