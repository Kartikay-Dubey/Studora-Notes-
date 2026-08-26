import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { subjectColors } from '@/lib/validations/subject'
import { getSubjectColorClass } from '@/lib/utils'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background p-8 text-text-primary">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Design System Verification</h1>
            <p className="text-text-secondary">Visual token & component showcase for Studora</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Tokens */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Semantic Colors</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-md border border-border bg-background p-4 text-center">
              <span className="text-xs font-medium text-text-muted">Background</span>
            </div>
            <div className="rounded-md border border-border bg-surface p-4 text-center">
              <span className="text-xs font-medium text-text-muted">Surface</span>
            </div>
            <div className="rounded-md border border-border bg-surface-raised p-4 text-center">
              <span className="text-xs font-medium text-text-muted">Surface Raised</span>
            </div>
            <div className="rounded-md bg-accent p-4 text-center text-accent-foreground">
              <span className="text-xs font-medium">Accent</span>
            </div>
          </div>
        </section>

        {/* Subject Palette */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Subject Palette</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {subjectColors.map((color) => (
              <div key={color} className="flex flex-col items-center gap-1.5">
                <div className={`h-10 w-full rounded-md ${getSubjectColorClass(color)}`} />
                <span className="text-xs capitalize text-text-secondary">{color}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="primary" size="sm">Small</Button>
          </div>
        </section>

        <Separator />

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Badges</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        <Separator />

        {/* Cards & Inputs */}
        <section className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Sample card description for Studora UI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary">Sample Input</label>
                <Input placeholder="Enter text here..." />
              </div>
              <Button className="w-full">Action Button</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading</CardTitle>
              <CardDescription>Pulsing loading state placeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
