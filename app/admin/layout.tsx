import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Navigation */}
      <nav className="border-b border-border sticky top-0 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="text-2xl font-bold text-primary">
            JobHub Admin
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Users
            </Link>
            <Link href="/admin/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </Link>
          </div>
          <Link href="/dashboard" className="text-sm text-primary hover:underline">
            Back to App
          </Link>
        </div>
      </nav>

      {/* Content */}
      {children}
    </div>
  )
}
