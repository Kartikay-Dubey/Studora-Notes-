'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile drawer whenever route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Open navigation menu"
          className="md:hidden text-text-secondary hover:text-text-primary size-8"
        >
          <Menu className="size-5" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="fixed inset-y-0 left-0 z-50 h-full w-72 max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r border-border bg-surface p-0 shadow-2xl duration-300 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
      >
        <DialogTitle className="sr-only">Mobile Navigation Menu</DialogTitle>
        <Sidebar
          isMobileDrawer
          onNavigate={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
