import type React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | Hirrd",
  description: "Login or Sign up to Hirrd to find jobs or hire talent.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
