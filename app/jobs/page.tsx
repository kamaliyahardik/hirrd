"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, MapPin, DollarSign, Search, BookmarkIcon } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Job {
  id: string
  title: string
  description: string
  location: string
  job_type: string
  salary_min?: number
  salary_max?: number
  currency: string
  companies?: { name: string }
  views_count: number
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)

      let query = supabase.from("jobs").select("*, companies(name)").eq("status", "open")

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      if (locationFilter) {
        query = query.ilike("location", `%${locationFilter}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching jobs:", error)
      } else {
        setJobs(data || [])
      }

      setIsLoading(false)
    }

    const timer = setTimeout(() => {
      fetchJobs()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, locationFilter, supabase])

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Jobs</h1>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>

        {/* Search Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Job title, keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
          <Input
            placeholder="City or region..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10"
          />
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No jobs found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{job.companies?.name || "Company"}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            {job.job_type}
                          </div>
                          {job.salary_min && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <DollarSign className="w-4 h-4" />
                              {`${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()} ${job.currency}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="mt-1">
                        <BookmarkIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
