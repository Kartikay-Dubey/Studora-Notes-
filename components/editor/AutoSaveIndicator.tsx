'use client'

import { Check, Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

interface AutoSaveIndicatorProps {
  status: SaveStatus
}

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-muted select-none">
      {status === 'saving' && (
        <>
          <Loader2 className="size-3 animate-spin text-accent" />
          <span>Saving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="size-3 text-success" />
          <span className="text-text-muted">Saved</span>
        </>
      )}

      {status === 'unsaved' && (
        <>
          <span className="size-2 rounded-full bg-warning" />
          <span>Unsaved changes</span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="size-3 text-destructive" />
          <span className="text-destructive">Save failed</span>
        </>
      )}
    </div>
  )
}
