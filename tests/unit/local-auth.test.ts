import { describe, it, expect, beforeEach } from 'vitest'
import { LocalAuthRepository, DEMO_USER, DEMO_PASSWORD } from '@/lib/repositories/auth.repository'

describe('LocalAuthRepository', () => {
  let authRepo: LocalAuthRepository

  beforeEach(() => {
    authRepo = new LocalAuthRepository()
  })

  it('authenticates successfully with valid demo credentials', async () => {
    const session = await authRepo.login(DEMO_USER.email, DEMO_PASSWORD)
    expect(session.user.email).toBe(DEMO_USER.email)
    expect(session.token).toContain('local-demo-token')
  })

  it('rejects invalid password with helpful error message', async () => {
    await expect(authRepo.login(DEMO_USER.email, 'WrongPassword123!')).rejects.toThrow(
      'Incorrect email or password.'
    )
  })

  it('rejects non-existent email', async () => {
    await expect(authRepo.login('unknown@student.com', DEMO_PASSWORD)).rejects.toThrow(
      'Incorrect email or password.'
    )
  })
})
