import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema, resetPasswordSchema } from '@/lib/validations/auth'

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'alex@studora.app',
        password: 'securepassword123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects short passwords', () => {
      const result = loginSchema.safeParse({
        email: 'alex@studora.app',
        password: 'short',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('signupSchema', () => {
    it('requires matching passwords', () => {
      const result = signupSchema.safeParse({
        displayName: 'Alex',
        email: 'alex@studora.app',
        password: 'password123',
        confirmPassword: 'differentpassword',
      })
      expect(result.success).toBe(false)
    })

    it('validates matching signup passwords', () => {
      const result = signupSchema.safeParse({
        displayName: 'Alex',
        email: 'alex@studora.app',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('resetPasswordSchema', () => {
    it('validates email format', () => {
      expect(resetPasswordSchema.safeParse({ email: 'invalid' }).success).toBe(false)
      expect(resetPasswordSchema.safeParse({ email: 'user@studora.app' }).success).toBe(true)
    })
  })
})
