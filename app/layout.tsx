import { ClerkProvider } from '@clerk/nextjs'

import type { Metadata } from 'next'
import {
  Inter,
  Lora,
  JetBrains_Mono,
  Patrick_Hand,
  Kalam,
  Caveat,
  Indie_Flower,
  Shadows_Into_Light,
  Handlee,
} from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-patrick-hand',
})

const kalam = Kalam({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kalam',
})

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
})

const indieFlower = Indie_Flower({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-indie-flower',
})

const shadowsIntoLight = Shadows_Into_Light({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-shadows-into-light',
})

const handlee = Handlee({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-handlee',
})

export const metadata: Metadata = {
  title: {
    template: '%s — Studora',
    default: 'Studora — Your Study Workspace',
  },
  description:
    'A purpose-built student study workspace for capturing, organizing, and mastering knowledge.',
  keywords: ['study', 'notes', 'flashcards', 'student', 'education', 'knowledge'],
  icons: {
    icon: '/brand/favicon.svg',
    shortcut: '/brand/favicon.svg',
  },
}

import { ConvexClientProvider } from '@/components/providers/ConvexClientProvider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} ${patrickHand.variable} ${kalam.variable} ${caveat.variable} ${indieFlower.variable} ${shadowsIntoLight.variable} ${handlee.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <ClerkProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <ConvexClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
