'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { cn } from '@/lib/utils'

interface AppShellProps {
  children: React.ReactNode
  user?: {
    email?: string
    user_metadata?: {
      display_name?: string
      avatar_url?: string
    }
  } | null
}

export function AppShell({ children, user }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const pathname = usePathname()

  const isEditorPage = pathname.startsWith('/notes/') && pathname !== '/notes'

  // Restore sidebar collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('studora-sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('studora-sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar Navigation */}
      <div className="flex shrink-0">
        <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      </div>

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {!isEditorPage && (
          <TopBar onOpenCommandPalette={() => setCommandPaletteOpen(true)} user={user} />
        )}
        <main
          className={cn(
            'flex-1 overflow-y-auto scrollbar-none min-w-0',
            isEditorPage ? 'p-0 h-full flex flex-col' : 'p-6'
          )}
          id="main-content"
        >
          {children}
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette />
    </div>
  )
}
