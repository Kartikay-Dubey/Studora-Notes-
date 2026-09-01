'use client'

import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { MobileNav } from '@/components/layout/MobileNav'
import { Button } from '@/components/ui/button'

interface TopBarProps {
  onOpenCommandPalette: () => void
  user?: {
    email?: string
    user_metadata?: {
      display_name?: string
      avatar_url?: string
    }
  } | null
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const pathname = usePathname()

  // Format breadcrumb section title from route path
  const getBreadcrumbTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname === '/notes') return 'All Notes'
    if (pathname === '/archive') return 'Trash & Archive'
    if (pathname.startsWith('/subjects/')) return 'Subject Notes'
    const segment = pathname.split('/')[1]
    if (!segment) return 'Dashboard'
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  return (
    <header className="flex h-13 items-center justify-between border-b border-border bg-surface px-3 sm:px-4 select-none shrink-0 min-w-0">
      {/* Left: Mobile Nav Drawer Trigger + Breadcrumb Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <MobileNav />
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-text-primary truncate min-w-0">
          <span className="text-text-muted hidden xs:inline">Studora</span>
          <span className="text-text-muted hidden xs:inline">/</span>
          <span className="font-semibold truncate">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Right: Global Search Trigger */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search Command Palette Trigger (Desktop / Tablet) */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex h-8 gap-3 px-3 text-xs text-text-secondary hover:text-text-primary"
        >
          <div className="flex items-center gap-1.5">
            <Search className="size-3.5" />
            <span>Search workspace...</span>
          </div>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-surface px-1 font-mono text-[10px] text-text-muted">
            <span className="text-[10px]">⌘</span>K
          </kbd>
        </Button>

        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenCommandPalette}
          className="sm:hidden text-text-secondary hover:text-text-primary size-8"
          aria-label="Search workspace"
        >
          <Search className="size-4" />
        </Button>
      </div>
    </header>
  )
}
