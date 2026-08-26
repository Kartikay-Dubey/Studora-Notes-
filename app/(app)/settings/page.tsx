'use client'

import { useState } from 'react'
import { Sun, Moon, Laptop, Keyboard, User as UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [displayName, setDisplayName] = useState('Alex Rivers')
  const [isSaved, setIsSaved] = useState(false)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">Settings</h1>
        <p className="text-sm text-text-secondary">
          Manage your profile details, appearance preferences, and view keyboard shortcuts.
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserIcon className="size-5 text-accent" />
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </div>
          <CardDescription>Update your account display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Rivers"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm">
                Save Profile
              </Button>
              {isSaved && (
                <span className="text-xs font-medium text-success">Profile updated successfully!</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance / Theme Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sun className="size-5 text-accent" />
            <CardTitle className="text-lg">Appearance</CardTitle>
          </div>
          <CardDescription>Choose how Studora looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-fast ${
                theme === 'light'
                  ? 'border-accent bg-accent-subtle text-accent font-semibold'
                  : 'border-border bg-surface text-text-secondary hover:border-border-strong'
              }`}
            >
              <Sun className="size-6" />
              <span className="text-xs">Light</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-fast ${
                theme === 'dark'
                  ? 'border-accent bg-accent-subtle text-accent font-semibold'
                  : 'border-border bg-surface text-text-secondary hover:border-border-strong'
              }`}
            >
              <Moon className="size-6" />
              <span className="text-xs">Dark</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] border p-4 transition-fast ${
                theme === 'system'
                  ? 'border-accent bg-accent-subtle text-accent font-semibold'
                  : 'border-border bg-surface text-text-secondary hover:border-border-strong'
              }`}
            >
              <Laptop className="size-6" />
              <span className="text-xs">System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Reference */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="size-5 text-accent" />
            <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
          </div>
          <CardDescription>Keyboard controls for rapid workspace navigation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="text-text-primary font-medium">Open Command Palette</span>
              <kbd className="inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-surface px-2 font-mono text-xs text-text-muted">
                <span>⌘</span>K / Ctrl+K
              </kbd>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="text-text-primary font-medium">Create New Note</span>
              <kbd className="inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-surface px-2 font-mono text-xs text-text-muted">
                <span>⌘</span>N / Ctrl+N
              </kbd>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-border">
              <span className="text-text-primary font-medium">Close Modal / Dialog</span>
              <kbd className="inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-surface px-2 font-mono text-xs text-text-muted">
                ESC
              </kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
