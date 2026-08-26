export interface AuthUser {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  created_at: string
}

export interface AuthSession {
  user: AuthUser
  token: string
  expiresAt: string
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthSession>
  getCurrentSession(): Promise<AuthSession | null>
  logout(): Promise<void>
}

// Seeded local demo account credentials
export const DEMO_USER: AuthUser = {
  id: 'user-demo-student-001',
  email: 'demo@studora.local',
  displayName: 'Demo Student',
  avatarUrl: undefined,
  created_at: new Date().toISOString(),
}

export const DEMO_PASSWORD = 'StudoraDemo123!'
const SESSION_STORAGE_KEY = 'studora_demo_session'

export class LocalAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthSession> {
    // Simulate slight natural async delay for realistic UI feedback
    await new Promise((resolve) => setTimeout(resolve, 350))

    const cleanEmail = email.toLowerCase().trim()
    if (cleanEmail === DEMO_USER.email.toLowerCase() && password === DEMO_PASSWORD) {
      const session: AuthSession = {
        user: DEMO_USER,
        token: 'local-demo-token-' + Date.now(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
        document.cookie = 'studora_demo_session=1; path=/; max-age=604800; SameSite=Lax'
      }

      return session
    }

    throw new Error('Incorrect email or password.')
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!stored) {
        document.cookie = 'studora_demo_session=; path=/; max-age=0'
        return null
      }

      const session: AuthSession = JSON.parse(stored)
      // Check expiration
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem(SESSION_STORAGE_KEY)
        document.cookie = 'studora_demo_session=; path=/; max-age=0'
        return null
      }

      // Ensure cookie is in sync
      document.cookie = 'studora_demo_session=1; path=/; max-age=604800; SameSite=Lax'
      return session
    } catch {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      document.cookie = 'studora_demo_session=; path=/; max-age=0'
      return null
    }
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      document.cookie = 'studora_demo_session=; path=/; max-age=0'
    }
  }
}
