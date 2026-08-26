'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In demo mode, automatically sign in with demo credentials
      await login('demo@studora.local', 'StudoraDemo123!')
      router.push('/dashboard')
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface p-8 shadow-md"
    >
      <div className="mb-6 text-center space-y-2 select-none">
        <div className="inline-flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-accent text-accent-foreground mb-2 shadow-sm">
          <BookOpen className="size-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Create an account</h1>
        <p className="text-sm text-text-secondary">Start your personal academic digital notebook</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-text-secondary">
            Display name
          </Label>
          <Input
            id="name"
            placeholder="Alex Rivers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-text-secondary">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-text-secondary">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-10"
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full h-10 font-semibold" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              <span>Creating account...</span>
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-text-muted select-none">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Sign in
        </Link>
      </div>
    </motion.div>
  )
}
