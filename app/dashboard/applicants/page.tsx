"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Users, MapPin } from "lucide-react"

interface Applicant {
  id: string
  status: string
  created_at: string
  cover_letter?: string
  users?: {
    full_name: string
    location: string
    bio: string
  }
  jobs?: {
    id: string
    title: string
  }
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchApplicants = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      let query = supabase
        .from("applications")
        .select("*, users(full_name, location, bio), jobs(id, title)")
        .eq("jobs.recruiter_id", user.id)

      if (filterStatus) {
        query = query.eq("status", filterStatus)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching applicants:", error)
      } else {
        setApplicants(data || [])
      }

      setIsLoading(false)
    }

    fetchApplicants()
  }, [router, supabase, filterStatus])

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      await supabase.from("applications").update({ status: newStatus }).eq("id", applicantId)

      setApplicants((prev) => prev.map((app) => (app.id === applicantId ? { ...app, status: newStatus } : app)))
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const statusColors = {
    applied: "bg-blue-100 text-blue-800",
    viewed: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }

  const uniqueStatuses = ["applied", "viewed", "shortlisted", "rejected"]

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
        <h1 className="text-3xl font-bold text-foreground mb-2">Applications</h1>
        <p className="text-muted-foreground">Review and manage applications for your job postings</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Button
          variant={!filterStatus ? "default" : "outline"}
          onClick={() => setFilterStatus(null)}
          className={!filterStatus ? "" : "bg-transparent"}
        >
          All ({applicants.length})
        </Button>
        {uniqueStatuses.map((status) => {
          const count = applicants.filter((a) => a.status === status).length
          return (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className={filterStatus === status ? "" : "bg-transparent"}
            >
              {status} ({count})
            </Button>
          )
        })}
      </div>

      {applicants.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{applicant.users?.full_name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Applied for: {applicant.jobs?.title}</p>

                    {applicant.users?.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {applicant.users.location}
                      </div>
                    )}

                    {applicant.cover_letter && (
                      <p className="text-sm text-muted-foreground line-clamp-2 italic mb-3">
                        "{applicant.cover_letter}"
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(applicant.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge className={statusColors[applicant.status as keyof typeof statusColors]}>
                      {applicant.status}
                    </Badge>

                    <select
                      value={applicant.status}
                      onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="applied">Applied</option>
                      <option value="viewed">Viewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
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
