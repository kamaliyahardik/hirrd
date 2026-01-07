import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarNav } from "@/components/sidebar-nav"

export default async function DashboardLayout({
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

  // Get user role
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav userRole={userData?.role} />
      <div className="md:ml-64">{children}</div>
    </div>
  )
}
