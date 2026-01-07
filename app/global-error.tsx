"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-8">We're working to fix this issue. Please try again later.</p>
            <div className="space-y-3">
              <Button onClick={() => reset()} className="w-full">
                Try again
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <a href="/">Back to Home</a>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
