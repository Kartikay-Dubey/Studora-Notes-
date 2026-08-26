'use client'

import { useEffect, useState } from 'react'
import { authService } from '@/lib/services/auth.service'
import type { AuthUser } from '@/lib/repositories/auth.repository'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(authService.getCurrentUser())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      const activeUser = await authService.init()
      if (isMounted) {
        setUser(activeUser)
        setIsLoading(false)
      }
    }

    checkAuth()

    const unsubscribe = authService.subscribe((updatedUser) => {
      if (isMounted) {
        setUser(updatedUser)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: (email: string, pass: string) => authService.login(email, pass),
    logout: () => authService.logout(),
  }
}
