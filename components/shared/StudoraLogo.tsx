'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────────────────────────────
 * StudoraMark
 * Pure inline SVG — S-letter + open book + pen + sparkle
 * Scalable vector, no bitmaps, no external requests
 * ─────────────────────────────────────────────────────────────────────────── */

interface StudoraMarkProps {
  /** Pixel size of the bounding square */
  size?: number
  /** 'light' | 'dark' | 'mono' — controls fill palette */
  theme?: 'light' | 'dark' | 'mono'
  className?: string
  'aria-hidden'?: boolean
}

export function StudoraMark({
  size = 32,
  theme = 'light',
  className,
  'aria-hidden': ariaHidden,
}: StudoraMarkProps) {
  /* Palette depending on theme */
  const ink = theme === 'dark' ? '#E2E8F0' : theme === 'mono' ? 'currentColor' : '#0B192C'
  const greenS = theme === 'mono' ? 'currentColor' : '#16A34A'
  const bluePrimary = theme === 'mono' ? 'currentColor' : '#2563EB'
  const blueLight = theme === 'mono' ? 'currentColor' : '#60A5FA'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-label={ariaHidden ? undefined : 'Studora'}
      aria-hidden={ariaHidden ? true : undefined}
      role={ariaHidden ? undefined : 'img'}
      className={cn('shrink-0', className)}
    >
      {/* ── Bookmark ── */}
      <path d="M 22 80 L 22 95 L 28 90 L 34 95 L 34 80 Z" fill={bluePrimary} />
      
      {/* ── Notebook Outline ── */}
      <path 
        d="M 52 35 L 52 25 C 52 19.5 47.5 15 42 15 L 20 15 C 14.5 15 10 19.5 10 25 L 10 75 C 10 80.5 14.5 85 20 85 L 42 85 C 47.5 85 52 80.5 52 75 L 52 70" 
        fill="none" 
        stroke={ink} 
        strokeWidth="5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* ── Horizontal line ── */}
      <line x1="20" y1="70" x2="42" y2="70" stroke={ink} strokeWidth="5" strokeLinecap="round"/>

      {/* ── The "S" ── */}
      <path 
        d="M 40 32 C 40 28 36 25 31 25 C 26 25 22 28 22 32 C 22 38 40 38 40 44 C 40 48 36 51 31 51 C 26 51 22 48 22 44" 
        fill="none" 
        stroke={greenS} 
        strokeWidth="7.5" 
        strokeLinecap="round"
      />

      {/* ── Pen ── */}
      <g transform="translate(60, 48) rotate(15)">
        {/* Tip */}
        <path d="M -5 15 L 0 28 L 5 15 Z" fill={blueLight} stroke={ink} strokeWidth="4" strokeLinejoin="round"/>
        {/* Body */}
        <rect x="-5" y="-20" width="10" height="35" fill={bluePrimary} stroke={ink} strokeWidth="4" strokeLinejoin="round"/>
        {/* Clicker */}
        <path d="M -2.5 -20 L -2.5 -26 C -2.5 -28 2.5 -28 2.5 -26 L 2.5 -20" fill={bluePrimary} stroke={ink} strokeWidth="4" strokeLinejoin="round"/>
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * StudoraLogo — full brand lockup
 * Supports: full | icon | wordmark | monochrome variants
 * Supports: sm | md | lg sizes
 * ─────────────────────────────────────────────────────────────────────────── */

export type LogoVariant = 'full' | 'icon' | 'wordmark' | 'monochrome'
export type LogoSize = 'sm' | 'md' | 'lg'
export type LogoTheme = 'light' | 'dark' | 'mono'

interface StudoraLogoProps {
  variant?: LogoVariant
  size?: LogoSize
  theme?: LogoTheme
  /** Show the tagline "Your Study Workspace" below wordmark (full variant only) */
  showTagline?: boolean
  className?: string
}

const markSizeMap: Record<LogoSize, number> = {
  sm: 24,
  md: 30,
  lg: 40,
}

const wordmarkSizeMap: Record<LogoSize, string> = {
  sm: 'text-[14px]',
  md: 'text-[17px]',
  lg: 'text-[24px]',
}

const taglineSizeMap: Record<LogoSize, string> = {
  sm: 'text-[8px]',
  md: 'text-[9px]',
  lg: 'text-[11px]',
}

export function StudoraLogo({
  variant = 'full',
  size = 'md',
  theme = 'light',
  showTagline = false,
  className,
}: StudoraLogoProps) {
  const isMonochrome = variant === 'monochrome'
  const effectiveTheme: LogoTheme = isMonochrome ? 'mono' : theme

  const wordmarkColor =
    theme === 'dark'
      ? 'text-white'
      : theme === 'mono'
      ? 'text-current'
      : 'text-[#0B192C]'

  const taglineColor =
    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'

  /* ── Icon only */
  if (variant === 'icon') {
    return (
      <StudoraMark
        size={markSizeMap[size]}
        theme={effectiveTheme}
        className={className}
        aria-hidden={false}
      />
    )
  }

  /* ── Wordmark only */
  if (variant === 'wordmark') {
    return (
      <span
        className={cn(
          'font-bold tracking-tight select-none font-sans',
          wordmarkSizeMap[size],
          wordmarkColor,
          className
        )}
        aria-label="Studora"
      >
        Studora
      </span>
    )
  }

  /* ── Full lockup (full | monochrome) */
  return (
    <div
      className={cn('flex items-center gap-2 select-none', className)}
      aria-label="Studora — Write. Organize. Understand."
    >
      <StudoraMark
        size={markSizeMap[size]}
        theme={effectiveTheme}
        aria-hidden
      />
      <div className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            'font-bold tracking-tight font-sans leading-none',
            wordmarkSizeMap[size],
            wordmarkColor
          )}
        >
          Studora
        </span>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={cn(
                'font-sans font-medium',
                taglineSizeMap[size],
                taglineColor
              )}
            >
              Write. Organize. Understand.
            </span>
            <div className="flex items-center gap-0.5">
              <div className="size-1.5 rounded-full bg-[#16A34A]" />
              <div className="size-1.5 rounded-full bg-[#2563EB]" />
              <div className="size-1.5 rounded-full bg-[#F59E0B]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
