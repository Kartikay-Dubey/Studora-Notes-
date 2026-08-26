import { LocalAuthRepository, type AuthSession, type AuthUser, type IAuthRepository } from '@/lib/repositories/auth.repository'

type AuthChangeListener = (user: AuthUser | null) => void

class AuthService {
  private repo: IAuthRepository
  private listeners: Set<AuthChangeListener> = new Set()
  private currentSession: AuthSession | null = null
  private initialized = false

  constructor(repo?: IAuthRepository) {
    this.repo = repo || new LocalAuthRepository()
  }

  async init(): Promise<AuthUser | null> {
    if (this.initialized) return this.currentSession?.user || null

    this.currentSession = await this.repo.getCurrentSession()
    this.initialized = true
    return this.currentSession?.user || null
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const session = await this.repo.login(email, password)
    this.currentSession = session
    this.notifyListeners(session.user)
    return session.user
  }

  async logout(): Promise<void> {
    await this.repo.logout()
    this.currentSession = null
    this.notifyListeners(null)
  }

  getCurrentUser(): AuthUser | null {
    return this.currentSession?.user || null
  }

  isAuthenticated(): boolean {
    return !!this.currentSession
  }

  subscribe(listener: AuthChangeListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(user: AuthUser | null) {
    this.listeners.forEach((listener) => listener(user))
  }
}

export const authService = new AuthService()
