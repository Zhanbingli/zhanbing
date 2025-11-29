import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MMM dd, yyyy', { locale: enUS })
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MM-dd', { locale: enUS })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
} 
