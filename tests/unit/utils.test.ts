import { describe, it, expect } from 'vitest'
import {
  cn,
  formatDate,
  formatWordCount,
  estimateReadingTime,
  truncate,
  getInitials,
  getSubjectColorClass,
} from '@/lib/utils'

describe('lib/utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4')
      expect(cn('bg-red-500', false && 'bg-blue-500')).toBe('bg-red-500')
    })
  })

  describe('formatWordCount', () => {
    it('formats numbers with word/words suffix', () => {
      expect(formatWordCount(0)).toBe('0 words')
      expect(formatWordCount(1)).toBe('1 word')
      expect(formatWordCount(1500)).toBe('1,500 words')
      expect(formatWordCount(null)).toBe('0 words')
    })
  })

  describe('estimateReadingTime', () => {
    it('estimates reading time accurately based on 200 wpm', () => {
      expect(estimateReadingTime(0)).toBe('< 1 min read')
      expect(estimateReadingTime(150)).toBe('1 min read')
      expect(estimateReadingTime(450)).toBe('3 min read')
    })
  })

  describe('truncate', () => {
    it('truncates string longer than limit with ellipsis', () => {
      expect(truncate('Hello World', 5)).toBe('He...')
      expect(truncate('Hello', 10)).toBe('Hello')
    })
  })

  describe('getInitials', () => {
    it('generates correct initials from name or email', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Alice')).toBe('A')
      expect(getInitials('student@example.com')).toBe('S')
    })
  })

  describe('getSubjectColorClass', () => {
    it('returns correct background class for valid subject color', () => {
      expect(getSubjectColorClass('cobalt')).toBe('bg-subject-cobalt')
      expect(getSubjectColorClass('unknown')).toBe('bg-subject-slate')
    })
  })
})
