"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, Eye, Users, Plus, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  location: string
  status: string
  job_type: string
  views_count: number
  _applicantCount?: number
  created_at: string
}

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

      const { data: jobsData, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("recruiter_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
      } else {
        // Get applicant counts for each job
        const jobsWithCounts = await Promise.all(
          (jobsData || []).map(async (job) => {
            const { count } = await supabase
              .from("applications")
              .select("*", { count: "exact", head: true })
              .eq("job_id", job.id)

            return {
              ...job,
              _applicantCount: count || 0,
            }
          }),
        )

        setJobs(jobsWithCounts)
      }

      setIsLoading(false)
    }

    fetchJobs()
  }, [router, supabase])

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    setDeletingId(jobId)

    try {
      await supabase.from("jobs").delete().eq("id", jobId)
      setJobs((prev) => prev.filter((job) => job.id !== jobId))
    } catch (error) {
      console.error("Error deleting job:", error)
    } finally {
      setDeletingId(null)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Job Postings</h1>
          <p className="text-muted-foreground">Manage and track your job listings</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/jobs/create">
            <Plus className="w-4 h-4" />
            Post Job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No job postings yet</p>
            <Button asChild>
              <Link href="/dashboard/jobs/create">Create Your First Job Post</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                      <Badge className={statusColors[job.status as keyof typeof statusColors]}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{job.location}</p>

                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        {job.views_count} views
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {job._applicantCount} applicants
                      </div>
                      <div className="text-muted-foreground">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" asChild className="bg-transparent">
                      <Link href={`/dashboard/jobs/${job.id}/edit`}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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
