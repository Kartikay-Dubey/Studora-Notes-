'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { NoteService } from '@/lib/services/note.service'
import { NoteRepository } from '@/lib/repositories/note.repository'
import { useAuth } from '@/lib/hooks/useAuth'
import { SubjectModal } from '@/components/organization/SubjectModal'
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  Bookmark,
  Search,
  Archive,
  Plus,
  Star,
  Trash2,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StudoraLogo } from '@/components/shared/StudoraLogo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [subjectModalOpen, setSubjectModalOpen] = useState(false)

  const subjects = useLiveQuery(async () => {
    return await NoteRepository.getAllSubjects()
  })

  const handleCreateNote = async () => {
    const note = await NoteService.createNewNote('Untitled Note')
    router.push(`/notes/${note.id}`)
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-surface text-text-primary select-none shrink-0 overflow-hidden font-sans">
      {/* Header Branding */}
      <div className="flex h-14 items-center px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center hover:opacity-90 transition-opacity" aria-label="Studora workspace">
          <StudoraLogo variant="full" size="sm" theme="light" />
        </Link>
      </div>

      {/* Main Sidebar Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
        {/* New Note Button */}
        <Button
          onClick={handleCreateNote}
          variant="primary"
          size="sm"
          className="w-full justify-center gap-2 font-semibold shadow-xs h-9 text-xs"
        >
          <Plus className="size-4" />
          <span>New Note</span>
        </Button>

        {/* Quick Search Shortcut Box */}
        <Link
          href="/search"
          className="flex items-center justify-between rounded-[var(--radius-md)] border border-border bg-surface-raised px-3 py-1.5 text-xs text-text-muted hover:border-border-strong transition-fast"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5" />
            <span>Quick Search</span>
          </div>
          <kbd className="rounded bg-surface px-1.5 font-mono text-[10px] text-text-muted border border-border">
            Ctrl K
          </kbd>
        </Link>

        {/* Section: WORKSPACE */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">Workspace</p>
          <nav className="space-y-0.5 text-xs">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-1.5 font-medium transition-fast',
                pathname === '/dashboard' ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
              )}
            >
              <LayoutDashboard className="size-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/notes"
              className={cn(
                'flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-1.5 font-medium transition-fast',
                pathname === '/notes' ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
              )}
            >
              <FileText className="size-3.5" />
              <span>All Notes</span>
            </Link>

            <Link
              href="/notes"
              className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-1.5 text-text-secondary hover:bg-surface-raised hover:text-text-primary transition-fast"
            >
              <Star className="size-3.5 text-tertiary-amber" />
              <span>Favorites</span>
            </Link>

            <Link
              href="/archive"
              className={cn(
                'flex items-center gap-2.5 rounded-[var(--radius-md)] px-2.5 py-1.5 font-medium transition-fast',
                pathname === '/archive' ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
              )}
            >
              <Trash2 className="size-3.5 text-text-muted" />
              <span>Trash</span>
            </Link>
          </nav>
        </div>

        {/* Section: SUBJECTS */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Subjects</p>
            <button
              onClick={() => setSubjectModalOpen(true)}
              className="text-[11px] text-accent hover:underline flex items-center gap-0.5"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <div className="space-y-0.5 text-xs">
            {subjects?.map((sub) => {
              const isActive = pathname === `/subjects/${sub.id}`
              const colorDot =
                sub.color === 'indigo'
                  ? 'bg-blue-600'
                  : sub.color === 'teal'
                  ? 'bg-teal-500'
                  : sub.color === 'amber'
                  ? 'bg-amber-500'
                  : sub.color === 'cobalt'
                  ? 'bg-indigo-600'
                  : 'bg-emerald-500'

              return (
                <Link
                  key={sub.id}
                  href={`/subjects/${sub.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-1.5 font-medium transition-fast',
                    isActive ? 'bg-accent-subtle text-accent font-semibold' : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                  )}
                >
                  <span className={cn('size-2 rounded-full shrink-0', colorDot)} />
                  <span className="truncate">{sub.name}</span>
                </Link>
              )
            })}

            <button
              onClick={() => setSubjectModalOpen(true)}
              className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-2.5 py-1.5 text-xs text-accent hover:bg-accent-subtle/50 transition-fast"
            >
              <Plus className="size-3.5" />
              <span>New Subject</span>
            </button>
          </div>
        </div>


      </div>

      {/* Footer User Profile */}
      <div className="border-t border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-800 text-xs">
            {user?.displayName?.[0] || 'D'}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-text-primary truncate">{user?.displayName || 'Demo Student'}</p>
            <p className="text-[10px] text-text-muted truncate">{user?.email || 'demo@studora.local'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleSignOut}
            className="p-1.5 text-text-muted hover:text-destructive transition-fast"
            title="Sign Out"
          >
            <LogOut className="size-3.5" />
          </button>
        </div>
      </div>

      <SubjectModal
        open={subjectModalOpen}
        onOpenChange={setSubjectModalOpen}
      />
    </aside>
  )
}
