"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Users, Briefcase, TrendingUp, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Stats {
  totalUsers: number
  totalJobs: number
  totalApplications: number
  activeJobs: number
  userGrowth: number
  jobGrowth: number
  appRate: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    userGrowth: 0,
    jobGrowth: 0,
    appRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/admin/login")
        return
      }

      // Check if user is admin
      const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

      if (userData?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      // Fetch stats
      const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      const { count: jobCount } = await supabase.from("jobs").select("*", { count: "exact", head: true })

      const { count: appCount } = await supabase.from("applications").select("*", { count: "exact", head: true })

      const { count: activeCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("status", "open")

      // Calculate Growth (Last 30 days vs previous 30 days)
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()

      const { count: currentUsers } = await supabase.from("users").select("*", { count: "exact", head: true }).gt("created_at", thirtyDaysAgo)
      const { count: previousUsers } = await supabase.from("users").select("*", { count: "exact", head: true }).gt("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo)

      const { count: currentJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).gt("created_at", thirtyDaysAgo)
      const { count: previousJobs } = await supabase.from("jobs").select("*", { count: "exact", head: true }).gt("created_at", sixtyDaysAgo).lt("created_at", thirtyDaysAgo)

      const userGrowth = (previousUsers || 0) === 0 ? ((currentUsers || 0) > 0 ? 100 : 0) : (((currentUsers || 0) - (previousUsers || 0)) / (previousUsers || 1)) * 100
      const jobGrowth = (previousJobs || 0) === 0 ? ((currentJobs || 0) > 0 ? 100 : 0) : (((currentJobs || 0) - (previousJobs || 0)) / (previousJobs || 1)) * 100
      const appRate = (jobCount || 0) === 0 ? 0 : (appCount || 0) / (jobCount || 1)

      setStats({
        totalUsers: userCount || 0,
        totalJobs: jobCount || 0,
        totalApplications: appCount || 0,
        activeJobs: activeCount || 0,
        userGrowth: Math.round(userGrowth),
        jobGrowth: Math.round(jobGrowth),
        appRate: parseFloat(appRate.toFixed(1)),
      })

      setIsLoading(false)
    }

    fetchStats()
  }, [router, supabase])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Logout failed")
    } else {
      router.push("/admin/login")
      toast.success("Logged out successfully")
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management tools</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-2">Job seekers & recruiters</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground mt-2">All listings</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground mt-2">Open positions</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              <BarChart3 className="w-4 h-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground mt-2">Total submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/users"
              className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium text-foreground">Manage Users</p>
              <p className="text-xs text-muted-foreground">View and manage user accounts</p>
            </a>
            <a
              href="/admin/jobs"
              className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium text-foreground">Moderate Jobs</p>
              <p className="text-xs text-muted-foreground">Approve or reject job postings</p>
            </a>
            <a
              href="/admin/reports"
              className="block p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <p className="font-medium text-foreground">View Reports</p>
              <p className="text-xs text-muted-foreground">Check platform reports and analytics</p>
            </a>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">User Growth</span>
              <span className={`text-sm font-medium ${stats.userGrowth >= 0 ? "text-green-600" : "text-destructive"}`}>
                {stats.userGrowth >= 0 ? "+" : ""}{stats.userGrowth}% this month
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Job Posts</span>
              <span className={`text-sm font-medium ${stats.jobGrowth >= 0 ? "text-green-600" : "text-destructive"}`}>
                {stats.jobGrowth >= 0 ? "+" : ""}{stats.jobGrowth}% this month
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Application Rate</span>
              <span className="text-sm font-medium text-blue-600">{stats.appRate} avg/job</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
