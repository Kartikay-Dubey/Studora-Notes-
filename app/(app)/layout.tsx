'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useConvexAuth, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

import { AppShell } from '@/components/layout/AppShell'
import { Loader2 } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { isAuthenticated } = useConvexAuth()
  const storeUser = useMutation(api.users.storeUser)
  const router = useRouter()
  const storedRef = useRef(false)

  // Debug token
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getToken({ template: "convex" }).then(token => {
        console.log("[Studora Debug] Clerk convex token:", token ? "Exists (length: " + token.length + ")" : "NULL")
      }).catch(err => {
        console.error("[Studora Debug] Clerk token error:", err)
      })
    }
  }, [isLoaded, isSignedIn, getToken])

  // Sync Clerk user into Convex DB once JWT is verified — run only once per session
  useEffect(() => {
    if (isAuthenticated && !storedRef.current) {
      storedRef.current = true
      storeUser().catch((err) => {
        console.warn('[Studora] storeUser failed:', err)
        storedRef.current = false // allow retry
      })
    }
  }, [isAuthenticated, storeUser])

  // Redirect unauthenticated users
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in')
    }
  }, [isLoaded, isSignedIn, router])

  // Show spinner only while Clerk is initializing (fast, <500ms)
  if (!isLoaded) {
    return <LoadingScreen message="Initializing..." />
  }

  // Not signed in → redirect in progress
  if (!isSignedIn) {
    return null
  }

  // Signed in — render immediately.
  // Queries return [] gracefully until Convex auth + storeUser complete.
  // Mutations are protected by isAuthenticated checks inside each handler.
  return <AppShell>{children}</AppShell>
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-7 animate-spin text-accent" />
        <p className="text-sm font-medium text-text-secondary">{message}</p>
      </div>
    </div>
  )
}
