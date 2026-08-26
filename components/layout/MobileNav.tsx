'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  BookOpen,
  LayoutDashboard,
  FileText,
  FolderKanban,
  GraduationCap,
  CheckSquare,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Notes', href: '/notes', icon: FileText },
  { name: 'Subjects', href: '/subjects', icon: FolderKanban },
  { name: 'Study Tools', href: '/study', icon: GraduationCap },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation menu" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-0 left-0 translate-x-0 translate-y-0 h-full w-72 max-w-xs rounded-none border-r border-border p-0 sm:max-w-xs">
        <DialogHeader className="flex h-13 flex-row items-center gap-2 border-b border-border px-4 py-0 text-left">
          <div className="flex size-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent text-accent-foreground">
            <BookOpen className="size-4" />
          </div>
          <DialogTitle className="text-base font-bold tracking-tight">Studora</DialogTitle>
        </DialogHeader>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex h-10 items-center gap-3 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-fast',
                  isActive
                    ? 'bg-accent-subtle text-accent font-semibold'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                )}
              >
                <Icon className={cn('size-4', isActive ? 'text-accent' : 'text-text-secondary')} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </DialogContent>
    </Dialog>
  )
}
