import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <BarChart3 className="w-16 h-16 text-muted-foreground opacity-50" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-8">Page not found</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
