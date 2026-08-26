'use client'

import { ReactNode } from 'react'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://placeholder-deployment.convex.cloud'
const convex = new ConvexReactClient(convexUrl)

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

