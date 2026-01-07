"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Briefcase, MapPin, Trash2 } from "lucide-react"
import Link from "next/link"

interface SavedJob {
  id: string
  jobs?: {
    id: string
    title: string
    location: string
    job_type: string
    companies?: { name: string }
    description: string
  }
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, jobs(id, title, location, job_type, companies(name), description)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching saved jobs:", error)
      } else {
        setSavedJobs(data || [])
      }

      setIsLoading(false)
    }

    fetchSavedJobs()
  }, [router, supabase])

  const handleDelete = async (savedJobId: string, e: React.MouseEvent) => {
    e.preventDefault()
    setDeletingId(savedJobId)

    try {
      await supabase.from("saved_jobs").delete().eq("id", savedJobId)

      setSavedJobs((prev) => prev.filter((job) => job.id !== savedJobId))
    } catch (error) {
      console.error("Error deleting saved job:", error)
    } finally {
      setDeletingId(null)
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
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Saved Jobs</h1>
        <p className="text-muted-foreground">Jobs you've bookmarked for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">You haven't saved any jobs yet</p>
            <Link href="/jobs" className="text-primary hover:underline font-medium">
              Browse jobs
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((savedJob) => (
            <Link key={savedJob.id} href={`/jobs/${savedJob.jobs?.id}`}>
              <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{savedJob.jobs?.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{savedJob.jobs?.companies?.name}</p>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{savedJob.jobs?.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {savedJob.jobs?.location}
                        </div>
                        <div>{savedJob.jobs?.job_type}</div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(savedJob.id, e)}
                      disabled={deletingId === savedJob.id}
                      className="mt-1"
                    >
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
