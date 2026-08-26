'use client'

import { useRef, useState } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RefreshCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DiagramView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const src = node.attrs.src as string | null
  const caption = (node.attrs.caption as string) || ''
  const width = (node.attrs.width as string) || '100%'
  const align = (node.attrs.align as 'left' | 'center' | 'right') || 'center'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        updateAttributes({ src: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        updateAttributes({ src: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <NodeViewWrapper className="my-4 font-sans select-none">
      {!src ? (
        /* Empty Diagram Placeholder */
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'group flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed p-8 text-center transition-fast cursor-pointer',
            isDragging
              ? 'border-accent bg-accent-subtle/50'
              : 'border-border bg-surface-raised/50 hover:border-accent/60 hover:bg-surface-raised'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex size-12 items-center justify-center rounded-full bg-surface border border-border shadow-2xs mb-3 group-hover:scale-105 transition-fast text-accent">
            <Upload className="size-5" />
          </div>
          <p className="text-sm font-semibold text-text-primary">Add Academic Diagram / Figure</p>
          <p className="text-xs text-text-muted mt-1 max-w-sm">
            Click to upload from device or drag and drop charts, architectural diagrams, or formulas
          </p>
        </div>
      ) : (
        /* Loaded Diagram Container */
        <div
          className={cn(
            'group relative flex flex-col my-2',
            align === 'left' && 'items-start',
            align === 'center' && 'items-center',
            align === 'right' && 'items-end'
          )}
        >
          <div
            style={{ width }}
            className="relative rounded-[var(--radius-lg)] border border-border bg-surface p-2 shadow-2xs transition-all overflow-hidden"
          >
            {/* Quick Action Overlay Controls */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-fast flex items-center gap-1 rounded-md bg-surface/90 backdrop-blur-xs border border-border p-1 shadow-md z-20">
              <Button
                variant={align === 'left' ? 'secondary' : 'ghost'}
                size="icon-sm"
                className="size-6"
                onClick={() => updateAttributes({ align: 'left' })}
                title="Align Left"
              >
                <AlignLeft className="size-3" />
              </Button>
              <Button
                variant={align === 'center' ? 'secondary' : 'ghost'}
                size="icon-sm"
                className="size-6"
                onClick={() => updateAttributes({ align: 'center' })}
                title="Align Center"
              >
                <AlignCenter className="size-3" />
              </Button>
              <Button
                variant={align === 'right' ? 'secondary' : 'ghost'}
                size="icon-sm"
                className="size-6"
                onClick={() => updateAttributes({ align: 'right' })}
                title="Align Right"
              >
                <AlignRight className="size-3" />
              </Button>

              <div className="w-[1px] h-3 bg-border mx-0.5" />

              <button
                onClick={() => updateAttributes({ width: width === '100%' ? '65%' : width === '65%' ? '40%' : '100%' })}
                className="px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary hover:text-text-primary rounded"
                title="Resize diagram width"
              >
                {width}
              </button>

              <div className="w-[1px] h-3 bg-border mx-0.5" />

              <Button
                variant="ghost"
                size="icon-sm"
                className="size-6 text-text-muted hover:text-accent"
                onClick={() => fileInputRef.current?.click()}
                title="Replace Diagram"
              >
                <RefreshCw className="size-3" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                className="size-6 text-text-muted hover:text-destructive"
                onClick={deleteNode}
                title="Delete Diagram"
              >
                <Trash2 className="size-3" />
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Render Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={node.attrs.alt || 'Academic Diagram'}
              className="w-full h-auto object-contain rounded-[var(--radius-md)] max-h-[600px]"
            />

            {/* Caption Input */}
            <div className="pt-2 px-1 text-center">
              <input
                type="text"
                value={caption}
                onChange={(e) => updateAttributes({ caption: e.target.value })}
                placeholder="Figure 1.0 — Diagram caption (optional)"
                className="w-full bg-transparent text-center text-xs italic text-text-muted placeholder:text-text-muted/60 focus:outline-none focus:text-text-secondary"
              />
            </div>
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
