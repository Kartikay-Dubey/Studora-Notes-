'use client'

import { Type, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface WritingFontPickerProps {
  font: string
  onChangeFont: (font: string) => void
}

export const WRITING_FONTS = [
  {
    id: "'Patrick Hand', cursive, sans-serif",
    label: 'Patrick Hand',
    category: 'Clean Student Hand',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Kalam', cursive, sans-serif",
    label: 'Kalam',
    category: 'Notebook Hand',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Caveat', cursive, sans-serif",
    label: 'Caveat',
    category: 'Natural Cursive',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Indie Flower', cursive, sans-serif",
    label: 'Indie Flower',
    category: 'Casual Handwriting',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Shadows Into Light', cursive, sans-serif",
    label: 'Shadows Into Light',
    category: 'Light Handwritten',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Handlee', cursive, sans-serif",
    label: 'Handlee',
    category: 'Neat Handwriting',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Inter', sans-serif",
    label: 'Clean Sans-Serif',
    category: 'Modern Digital',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'Lora', serif",
    label: 'Academic Serif',
    category: 'Book & Research',
    sample: 'Artificial Neural Network',
  },
  {
    id: "'JetBrains Mono', monospace",
    label: 'Code Monospace',
    category: 'Technical Notes',
    sample: 'Artificial Neural Network',
  },
]

export function WritingFontPicker({ font, onChangeFont }: WritingFontPickerProps) {
  const currentFont = WRITING_FONTS.find((f) => f.id === font) || WRITING_FONTS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-text-secondary hover:text-text-primary"
          title="Writing Style"
        >
          <Type className="size-3.5 text-accent" />
          <span className="hidden md:inline font-medium">{currentFont.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60 p-1 max-h-72 overflow-y-auto">
        <div className="text-[10px] font-semibold text-text-muted px-2 py-1 uppercase tracking-wider">
          Writing Style
        </div>
        {WRITING_FONTS.map((f) => (
          <DropdownMenuItem
            key={f.id}
            onClick={() => onChangeFont(f.id)}
            className={cn(
              'flex flex-col items-start text-xs cursor-pointer py-1.5 px-2 rounded',
              font === f.id && 'bg-accent-subtle font-semibold text-accent'
            )}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-xs text-text-primary">{f.label}</span>
              {font === f.id && <Check className="size-3 text-accent shrink-0" />}
            </div>
            <p style={{ fontFamily: f.id }} className="text-sm text-text-secondary mt-0.5 truncate w-full">
              {f.sample}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
