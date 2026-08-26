import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind CSS class names safely.
 * Combines clsx (conditional classes) + tailwind-merge (deduplication).
 * Used throughout the component library.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string for display.
 * Returns a human-friendly relative label for recent dates,
 * and an absolute date for older ones.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Returns a human-readable word count label.
 */
export function formatWordCount(count: number | null | undefined): string {
  if (!count) return '0 words'
  return `${count.toLocaleString()} ${count === 1 ? 'word' : 'words'}`
}

/**
 * Estimates reading time from word count.
 * Assumes average reading speed of 200 words per minute.
 */
export function estimateReadingTime(wordCount: number | null | undefined): string {
  if (!wordCount) return '< 1 min read'
  const mins = Math.ceil(wordCount / 200)
  return `${mins} min read`
}

/**
 * Truncates a string to a maximum length, appending ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Generates initials from a display name or email.
 * "Alice Smith" → "AS", "alice@example.com" → "A"
 */
export function getInitials(nameOrEmail: string): string {
  const name = nameOrEmail.split('@')[0] // strip email domain if present
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Returns a CSS color variable for a subject color name.
 * Maps design-system color names to their CSS variable.
 */
export function getSubjectColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    slate: 'bg-subject-slate',
    cobalt: 'bg-subject-cobalt',
    teal: 'bg-subject-teal',
    sage: 'bg-subject-sage',
    amber: 'bg-subject-amber',
    rust: 'bg-subject-rust',
    rose: 'bg-subject-rose',
    violet: 'bg-subject-violet',
    indigo: 'bg-subject-indigo',
    copper: 'bg-subject-copper',
    stone: 'bg-subject-stone',
    plum: 'bg-subject-plum',
  }
  return colorMap[color] ?? colorMap['slate']
}
