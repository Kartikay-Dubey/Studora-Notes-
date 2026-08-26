'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/lib/hooks/useAuth'
import { DEMO_USER, DEMO_PASSWORD } from '@/lib/repositories/auth.repository'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle')

  const handleQuickFillDemo = () => {
    setEmail(DEMO_USER.email)
    setPassword(DEMO_PASSWORD)
    setErrorMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    setFormState('submitting')

    try {
      await login(email, password)
      setFormState('success')

      // Short delay for success animation before navigating
      setTimeout(() => {
        window.location.href = redirectTo
      }, 350)
    } catch (err: unknown) {
      setFormState('idle')
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Failed to sign in. Please try again.')
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-md"
    >
      {/* Header Branding */}
      <div className="mb-6 text-center space-y-2 select-none">
        <div className="inline-flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-accent text-accent-foreground mb-2 shadow-sm">
          <BookOpen className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-secondary">Continue your distraction-free study workspace</p>
      </div>

      {/* Demo Account Quick-Fill Banner */}
      <div
        onClick={handleQuickFillDemo}
        className="mb-6 flex cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-md)] border border-accent/20 bg-accent-subtle/50 px-3.5 py-2.5 text-xs transition-fast hover:border-accent/40 hover:bg-accent-subtle select-none"
        title="Click to auto-fill demo credentials"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-accent shrink-0" />
          <div>
            <span className="font-semibold text-text-primary">Development Demo Account</span>
            <p className="text-[11px] text-text-muted">{DEMO_USER.email}</p>
          </div>
        </div>
        <span className="rounded bg-surface px-2 py-1 font-mono text-[10px] font-semibold text-accent shadow-xs">
          Click to fill
        </span>
      </div>

      {/* Calm Animated Inline Error Alert */}
      <AnimatePresence mode="wait">
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-destructive/20 bg-destructive-subtle/60 px-3.5 py-2.5 text-xs font-medium text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-text-secondary">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="demo@studora.local"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={formState !== 'idle'}
            required
            autoComplete="email"
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-text-secondary">
              Password
            </Label>
            <Link href="/reset-password" className="text-xs text-accent hover:underline select-none">
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={formState !== 'idle'}
              required
              autoComplete="current-password"
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-fast"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full h-10 font-semibold transition-fast"
          disabled={formState !== 'idle'}
        >
          {formState === 'submitting' && (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              <span>Signing in...</span>
            </>
          )}

          {formState === 'success' && (
            <>
              <CheckCircle2 className="size-4 text-success mr-2" />
              <span>Workspace Opening...</span>
            </>
          )}

          {formState === 'idle' && 'Sign in'}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted select-none">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-accent hover:underline">
          Sign up
        </Link>
      </div>
    </motion.div>
  )
}

function LoginSkeleton() {
  return (
    <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-8 space-y-4 shadow-sm animate-pulse">
      <div className="size-11 rounded-lg bg-surface-raised mx-auto" />
      <div className="h-6 w-1/2 bg-surface-raised mx-auto rounded" />
      <div className="h-10 bg-surface-raised rounded" />
      <div className="h-10 bg-surface-raised rounded" />
      <div className="h-10 bg-surface-raised rounded" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
