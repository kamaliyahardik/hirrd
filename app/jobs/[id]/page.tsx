"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Loader2,
  BookmarkIcon,
  Share2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  description: string
  location: string
  job_type: string
  salary_min?: number
  salary_max?: number
  currency: string
  skills_required: string[]
  views_count: number
  created_at: string
  expires_at?: string
  companies?: { name: string; logo_url?: string }
}

interface Application {
  id: string
  status: string
}

export default function JobDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [application, setApplication] = useState<Application | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setCurrentUser(user)

      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*, companies(name, logo_url)")
        .eq("id", jobId)
        .single()

      if (jobError) {
        console.error("Error fetching job:", jobError)
        router.push("/jobs")
        return
      }

      setJob(jobData)

      // Check if user has already applied
      if (user) {
        const { data: appData } = await supabase
          .from("applications")
          .select("*")
          .eq("job_id", jobId)
          .eq("applicant_id", user.id)
          .single()

        if (appData) {
          setApplication(appData)
        }

        // Check if job is saved
        const { data: savedData } = await supabase
          .from("saved_jobs")
          .select("*")
          .eq("job_id", jobId)
          .eq("user_id", user.id)
          .single()

        if (savedData) {
          setIsSaved(true)
        }
      }

      setIsLoading(false)
    }

    fetchData()
  }, [jobId, router, supabase])

  const handleApply = async () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setIsApplying(true)

    try {
      const { data, error } = await supabase.from("applications").insert({
        job_id: jobId,
        applicant_id: currentUser.id,
        status: "applied",
        cover_letter: coverLetter || null,
      })

      if (error) throw error

      // Refresh to show updated status
      router.refresh()
      setShowApplicationForm(false)
      setCoverLetter("")
    } catch (error) {
      console.error("Error applying:", error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleSaveJob = async () => {
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setIsSaving(true)

    try {
      if (isSaved) {
        await supabase.from("saved_jobs").delete().eq("job_id", jobId).eq("user_id", currentUser.id)

        setIsSaved(false)
      } else {
        await supabase.from("saved_jobs").insert({
          job_id: jobId,
          user_id: currentUser.id,
        })

        setIsSaved(true)
      }
    } catch (error) {
      console.error("Error saving job:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Job not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusColors = {
    applied: "bg-blue-50 border-blue-200 text-blue-800",
    viewed: "bg-yellow-50 border-yellow-200 text-yellow-800",
    shortlisted: "bg-green-50 border-green-200 text-green-800",
    rejected: "bg-red-50 border-red-200 text-red-800",
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/jobs" className="text-primary hover:underline text-sm font-medium mb-6 inline-block">
          ← Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{job.title}</h1>
              <p className="text-lg text-muted-foreground">{job.companies?.name || "Company"}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSaveJob}
                disabled={isSaving}
                className="bg-transparent"
              >
                <BookmarkIcon className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Application Status */}
          {application && (
            <div className={`p-4 rounded-lg border ${statusColors[application.status as keyof typeof statusColors]}`}>
              <div className="flex items-center gap-2">
                {application.status === "shortlisted" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-medium capitalize">
                  {application.status === "shortlisted"
                    ? "You've been shortlisted for this position!"
                    : `You ${application.status === "applied" ? "applied" : "were " + application.status} for this job`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Details */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Type</p>
                      <p className="font-medium text-foreground">{job.job_type}</p>
                    </div>
                  </div>

                  {job.salary_min && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Salary Range</p>
                        <p className="font-medium text-foreground">
                          {job.salary_min.toLocaleString()} - {job.salary_max?.toLocaleString()} {job.currency}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Posted</p>
                      <p className="font-medium text-foreground">{new Date(job.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle className="text-lg">About the Job</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {job.skills_required.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {application ? (
              <Card className="border-border sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-lg border ${statusColors[application.status as keyof typeof statusColors]}`}
                    >
                      <p className="font-medium capitalize">{application.status}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You have already applied for this position. Good luck!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {!showApplicationForm ? (
                  <Button onClick={() => setShowApplicationForm(true)} className="w-full h-11 mb-4">
                    Apply Now
                  </Button>
                ) : (
                  <Card className="border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Submit Application</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-2">Cover Letter</label>
                        <textarea
                          placeholder="Tell the recruiter why you're a great fit for this role..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          disabled={isApplying}
                        />
                      </div>

                      <div className="space-y-2">
                        <Button onClick={handleApply} disabled={isApplying} className="w-full h-10">
                          {isApplying ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                        <Button
                          onClick={() => setShowApplicationForm(false)}
                          variant="outline"
                          disabled={isApplying}
                          className="w-full h-10 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Link href="/auth/login">
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {!currentUser && "Sign in to apply to this job"}
                  </p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
