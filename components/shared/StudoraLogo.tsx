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
  const ink = theme === 'dark' ? '#4ade80' : theme === 'mono' ? 'currentColor' : '#166534'
  const pageLeft = theme === 'dark' ? '#1e2d24' : theme === 'mono' ? 'transparent' : '#f0fdf4'
  const gold = theme === 'mono' ? 'currentColor' : '#d97706'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-label={ariaHidden ? undefined : 'Studora'}
      aria-hidden={ariaHidden ? true : undefined}
      role={ariaHidden ? undefined : 'img'}
      className={cn('shrink-0', className)}
    >
      {/* ── Background Notebook Page Shield */}
      <path
        d="M32 6 C42 6, 52 10, 52 20 V44 C52 50, 44 58, 32 58 C20 58, 12 50, 12 44 V20 C12 10, 22 6, 32 6 Z"
        fill={pageLeft}
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* ── Stylized Book Ribbon tail dropping down at bottom */}
      <path
        d="M32 34 V48 L26 43.5 L20 48"
        stroke={gold}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* ── Elegant bookmark ribbon winding into an 'S' inside the page */}
      <path
        d="M22 22 H42 C47 22, 47 28, 42 28 H22 C17 28, 17 34, 22 34 H42"
        stroke={gold}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* ── Sparkle in top-right to represent insight/knowledge */}
      <path
        d="M48 10 H52 M50 8 V12"
        stroke={gold}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
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
      ? 'text-blue-100'
      : theme === 'mono'
      ? 'text-current'
      : 'text-[#1E3A7B]'

  const taglineColor =
    theme === 'dark' ? 'text-blue-200/60' : 'text-[#1E3A7B]/50'

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
      aria-label="Studora — Your Study Workspace"
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
          <span
            className={cn(
              'font-sans uppercase tracking-widest font-medium mt-0.5',
              taglineSizeMap[size],
              taglineColor
            )}
          >
            Your Study Workspace
          </span>
        )}
      </div>
    </div>
  )
}
