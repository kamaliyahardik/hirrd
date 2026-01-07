"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Briefcase } from "lucide-react"
import Link from "next/link"

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
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchJobs = async () => {
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

      let query = supabase.from("jobs").select("*, companies(name)")

      if (filterStatus) {
        query = query.eq("status", filterStatus)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
      } else {
        setJobs(data || [])
      }

      setIsLoading(false)
    }

    fetchJobs()
  }, [router, supabase, filterStatus])

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await supabase.from("jobs").update({ status: newStatus }).eq("id", jobId)

      setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
    } catch (error) {
      console.error("Error updating job status:", error)
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
      <div className="mb-8">
        <Link href="/admin" className="text-primary hover:underline text-sm font-medium inline-block mb-4">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Job Moderation</h1>
        <p className="text-muted-foreground">Review and manage job postings</p>
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

                  <div className="flex flex-col gap-2">
                    <Badge className={statusColors[job.status as keyof typeof statusColors]}>{job.status}</Badge>

                    <select
                      value={job.status}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="open">Open</option>
                      <option value="draft">Draft</option>
                      <option value="closed">Closed</option>
                    </select>
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
