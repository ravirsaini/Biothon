"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-lg py-16">
      <p className="text-xs font-medium tracking-[0.18em] text-clay uppercase">
        Something stalled
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">This page did not finish loading.</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        The rest of the studio is still there. Try this page again.
      </p>
      <Button type="button" onClick={reset} className="mt-6 h-10 px-4">
        Try again
      </Button>
    </div>
  )
}
