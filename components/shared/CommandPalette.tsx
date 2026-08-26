'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Search,
  Plus,
  FileText,
  Bookmark,
  LayoutDashboard,
  Moon,
  Sun,
  Settings,
  Maximize2,
  LogOut,
} from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { NoteService } from '@/lib/services/note.service'
import { useAuth } from '@/lib/hooks/useAuth'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const actions = [
    {
      id: 'new-note',
      name: 'Create New Note',
      category: 'Actions',
      icon: Plus,
      perform: async () => {
        const note = await NoteService.createNewNote('Untitled Note')
        router.push(`/notes/${note.id}`)
      },
    },
    {
      id: 'go-dashboard',
      name: 'Go to Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      perform: () => router.push('/dashboard'),
    },
    {
      id: 'go-notes',
      name: 'Go to Study Notes',
      category: 'Navigation',
      icon: FileText,
      perform: () => router.push('/notes'),
    },
    {
      id: 'go-subjects',
      name: 'Go to Subjects Shelf',
      category: 'Navigation',
      icon: Bookmark,
      perform: () => router.push('/subjects'),
    },
    {
      id: 'go-search',
      name: 'Search Notes & Topics',
      category: 'Navigation',
      icon: Search,
      perform: () => router.push('/search'),
    },
    {
      id: 'go-archive',
      name: 'Open Archive & Trash',
      category: 'Navigation',
      icon: FileText,
      perform: () => router.push('/archive'),
    },
    {
      id: 'go-settings',
      name: 'Go to Settings',
      category: 'Navigation',
      icon: Settings,
      perform: () => router.push('/settings'),
    },
    {
      id: 'toggle-theme',
      name: theme === 'dark' ? 'Switch to Light Notebook' : 'Switch to Dark Night Study',
      category: 'Preferences',
      icon: theme === 'dark' ? Sun : Moon,
      perform: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    },
    {
      id: 'sign-out',
      name: 'Sign Out',
      category: 'Auth',
      icon: LogOut,
      perform: async () => {
        await logout()
        router.push('/login')
      },
    },
  ]

  const filtered = query.trim()
    ? actions.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : actions

  const handleSelect = async (action: (typeof actions)[0]) => {
    setOpen(false)
    setQuery('')
    await action.perform()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-[var(--radius-xl)] border-border bg-surface-raised shadow-2xl top-[20%] translate-y-0 select-none">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Search className="size-4 text-text-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0"
            autoFocus
          />
          <kbd className="pointer-events-none hidden rounded bg-surface px-1.5 font-mono text-[10px] font-semibold text-text-muted sm:inline-block border border-border">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">No commands found.</div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-xs transition-fast hover:bg-surface focus:bg-surface outline-none"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-text-secondary">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-muted">{item.category}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
