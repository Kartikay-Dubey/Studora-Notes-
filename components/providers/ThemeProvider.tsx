'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Wraps next-themes provider for light/dark mode.
 * Strategy: class-based (adds 'dark' class to <html>).
 * Storage: localStorage ('studora-theme').
 * Default: system preference.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="studora-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
