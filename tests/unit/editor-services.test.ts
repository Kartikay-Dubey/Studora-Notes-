import { describe, it, expect } from 'vitest'
import { NoteService } from '@/lib/services/note.service'

describe('NoteService Editor Utilities', () => {
  describe('extractPlainText', () => {
    it('extracts text from nested Tiptap JSON node structures', () => {
      const tiptapJson = {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: { level: 1 },
            content: [{ type: 'text', text: 'Quantum Mechanics' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Wave-particle duality overview.' }],
          },
        ],
      }

      const extracted = NoteService.extractPlainText(tiptapJson)
      expect(extracted).toContain('Quantum Mechanics')
      expect(extracted).toContain('Wave-particle duality overview.')
    })
  })

  describe('calculateWordCount', () => {
    it('counts words accurately', () => {
      expect(NoteService.calculateWordCount('')).toBe(0)
      expect(NoteService.calculateWordCount('   ')).toBe(0)
      expect(NoteService.calculateWordCount('Organic Chemistry')).toBe(2)
      expect(NoteService.calculateWordCount('The quick brown fox jumps over the lazy dog')).toBe(9)
    })
  })

  describe('calculateReadingTime', () => {
    it('calculates reading time assuming 200 wpm', () => {
      expect(NoteService.calculateReadingTime(0)).toBe(1)
      expect(NoteService.calculateReadingTime(150)).toBe(1)
      expect(NoteService.calculateReadingTime(450)).toBe(3)
    })
  })
})
