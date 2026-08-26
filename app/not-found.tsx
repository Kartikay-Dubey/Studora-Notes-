import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-[var(--radius-xl)] bg-accent-subtle text-accent mb-4">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-text-primary">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        The study page or resource you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Button asChild variant="primary">
          <Link href="/dashboard" className="gap-2">
            <ArrowLeft className="size-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
