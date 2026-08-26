'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface TableInsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (rows: number, cols: number) => void
}

export function TableInsertDialog({ open, onOpenChange, onSubmit }: TableInsertDialogProps) {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)

  const handleCreate = () => {
    const r = Math.max(1, Math.min(20, rows))
    const c = Math.max(1, Math.min(10, cols))
    onSubmit(r, c)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[280px] p-4 bg-surface border border-border shadow-md rounded-[var(--radius-lg)]">
        <DialogHeader className="p-0 mb-3">
          <DialogTitle className="text-sm font-bold text-text-primary">Create Table</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Rows</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="h-8 text-xs bg-surface-raised border border-border rounded-[var(--radius-sm)] focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Columns</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              className="h-8 text-xs bg-surface-raised border border-border rounded-[var(--radius-sm)] focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-end gap-2 p-0 mt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-7 text-xs px-2.5">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleCreate} className="h-7 text-xs px-2.5 shadow-3xs">
            Create Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
