import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'yyyy年MM月dd日', { locale: zhCN })
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MM-dd', { locale: zhCN })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
} 