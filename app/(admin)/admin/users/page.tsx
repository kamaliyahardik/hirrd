"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Trash2, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

const USERS_PER_PAGE = 10

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Logout failed")
    } else {
      router.push("/admin/login")
      toast.success("Logged out successfully")
    }
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/admin/login")
      return
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      router.push("/dashboard")
      return
    }

    // 1. Fetch total count for pagination
    let countQuery = supabase.from("users").select("*", { count: "exact", head: true })
    if (filterRole) {
      countQuery = countQuery.eq("role", filterRole)
    }
    const { count } = await countQuery
    setTotalCount(count || 0)

    // 2. Fetch paginated users
    let query = supabase.from("users").select("*")

    if (filterRole) {
      query = query.eq("role", filterRole)
    }

    const from = (currentPage - 1) * USERS_PER_PAGE
    const to = from + USERS_PER_PAGE - 1

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } else {
      setUsers(data || [])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [router, supabase, filterRole, currentPage])

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filterRole])

  const totalPages = Math.ceil(totalCount / USERS_PER_PAGE)

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This will remove all their data.")) return

    setIsDeleting(userId)
    try {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast.success("User deleted successfully")
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast.error(error.message || "Failed to delete user")
    } finally {
      setIsDeleting(null)
    }
  }

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
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/admin" className="text-primary hover:underline text-sm font-medium inline-block mb-4">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">View and manage all users on the platform</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Button variant={!filterRole ? "default" : "outline"} onClick={() => setFilterRole(null)}>
          All Users
        </Button>
        <Button
          variant={filterRole === "job_seeker" ? "default" : "outline"}
          onClick={() => setFilterRole("job_seeker")}
          className={filterRole === "job_seeker" ? "" : "bg-transparent"}
        >
          Job Seekers
        </Button>
        <Button
          variant={filterRole === "recruiter" ? "default" : "outline"}
          onClick={() => setFilterRole("recruiter")}
          className={filterRole === "recruiter" ? "" : "bg-transparent"}
        >
          Recruiters
        </Button>
        <Button
          variant={filterRole === "admin" ? "default" : "outline"}
          onClick={() => setFilterRole("admin")}
          className={filterRole === "admin" ? "" : "bg-transparent"}
        >
          Admins
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

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                      {user.role.replace("_", " ")}
                    </Badge>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isDeleting === user.id}
                      className="h-8 w-8 p-0"
                    >
                      {isDeleting === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8 pb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
