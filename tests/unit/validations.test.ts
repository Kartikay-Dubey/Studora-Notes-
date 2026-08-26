import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '@/lib/validations/auth'
import { createSubjectSchema } from '@/lib/validations/subject'
import { createNoteSchema } from '@/lib/validations/note'

describe('Zod Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const valid = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' })
      expect(valid.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalid = loginSchema.safeParse({ email: 'invalid-email', password: 'password123' })
      expect(invalid.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('rejects passwords that do not match', () => {
      const result = signupSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('createSubjectSchema', () => {
    it('validates subject creation data', () => {
      const valid = createSubjectSchema.safeParse({
        name: 'Organic Chemistry',
        color: 'teal',
      })
      expect(valid.success).toBe(true)
    })
  })

  describe('createNoteSchema', () => {
    it('defaults title to Untitled if not provided', () => {
      const result = createNoteSchema.parse({})
      expect(result.title).toBe('Untitled')
    })
  })
})
