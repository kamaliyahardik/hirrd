"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Briefcase, Trash2, LogOut } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Job {
  id: string
  title: string
  location: string
  status: string
  job_type: string
  created_at: string
  companies?: { name: string }
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
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

  const fetchJobs = async () => {
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

    let query = supabase.from("jobs").select("*, companies(name)")

    if (filterStatus) {
      query = query.eq("status", filterStatus)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
      toast.error("Failed to load jobs")
    } else {
      setJobs(data || [])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    fetchJobs()
  }, [router, supabase, filterStatus])

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("jobs").update({ status: newStatus }).eq("id", jobId)
      if (error) throw error

      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
      toast.success(`Job status updated to ${newStatus}`)
    } catch (error: any) {
      console.error("Error updating job status:", error)
      toast.error(error.message || "Failed to update job status")
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    setIsDeleting(jobId)
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId)

      if (error) throw error

      setJobs((prev) => prev.filter((j) => j.id !== jobId))
      toast.success("Job deleted successfully")
    } catch (error: any) {
      console.error("Error deleting job:", error)
      toast.error(error.message || "Failed to delete job")
    } finally {
      setIsDeleting(null)
    }
  }

  const statusColors = {
    open: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Job Moderation</h1>
          <p className="text-muted-foreground">Review and manage job postings</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Button variant={!filterStatus ? "default" : "outline"} onClick={() => setFilterStatus(null)}>
          All Jobs ({jobs.length})
        </Button>
        <Button
          variant={filterStatus === "open" ? "default" : "outline"}
          onClick={() => setFilterStatus("open")}
          className={filterStatus === "open" ? "" : "bg-transparent"}
        >
          Open ({jobs.filter((j) => j.status === "open").length})
        </Button>
        <Button
          variant={filterStatus === "draft" ? "default" : "outline"}
          onClick={() => setFilterStatus("draft")}
          className={filterStatus === "draft" ? "" : "bg-transparent"}
        >
          Draft ({jobs.filter((j) => j.status === "draft").length})
        </Button>
        <Button
          variant={filterStatus === "closed" ? "default" : "outline"}
          onClick={() => setFilterStatus("closed")}
          className={filterStatus === "closed" ? "" : "bg-transparent"}
        >
          Closed ({jobs.filter((j) => j.status === "closed").length})
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No jobs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{job.companies?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.location} • {job.job_type} • Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={statusColors[job.status as keyof typeof statusColors]}>{job.status}</Badge>

                    <div className="flex gap-2">
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="flex h-9 w-32 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="open">Open</option>
                        <option value="draft">Draft</option>
                        <option value="closed">Closed</option>
                      </select>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={isDeleting === job.id}
                        className="h-9 w-9 p-0"
                      >
                        {isDeleting === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
