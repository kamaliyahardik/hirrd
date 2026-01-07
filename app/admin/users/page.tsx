"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Users } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUsers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

      if (userData?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      let query = supabase.from("users").select("*")

      if (filterRole) {
        query = query.eq("role", filterRole)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
      } else {
        setUsers(data || [])
      }

      setIsLoading(false)
    }

    fetchUsers()
  }, [router, supabase, filterRole])

  const roleColors = {
    job_seeker: "bg-blue-100 text-blue-800",
    recruiter: "bg-purple-100 text-purple-800",
    admin: "bg-red-100 text-red-800",
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <Link href="/admin" className="text-primary hover:underline text-sm font-medium inline-block mb-4">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
        <p className="text-muted-foreground">View and manage all users on the platform</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Button variant={!filterRole ? "default" : "outline"} onClick={() => setFilterRole(null)}>
          All Users ({users.length})
        </Button>
        <Button
          variant={filterRole === "job_seeker" ? "default" : "outline"}
          onClick={() => setFilterRole("job_seeker")}
          className={filterRole === "job_seeker" ? "" : "bg-transparent"}
        >
          Job Seekers ({users.filter((u) => u.role === "job_seeker").length})
        </Button>
        <Button
          variant={filterRole === "recruiter" ? "default" : "outline"}
          onClick={() => setFilterRole("recruiter")}
          className={filterRole === "recruiter" ? "" : "bg-transparent"}
        >
          Recruiters ({users.filter((u) => u.role === "recruiter").length})
        </Button>
      </div>

      {users.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{user.full_name || "User"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
