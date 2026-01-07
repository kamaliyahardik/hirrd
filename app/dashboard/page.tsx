import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Get stats for job seeker
  let stats = {
    applications: 0,
    saved: 0,
    viewed: 0,
  }

  if (userData?.role === "job_seeker") {
    const { count: appCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", user.id)

    const { count: savedCount } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    stats = {
      applications: appCount || 0,
      saved: savedCount || 0,
      viewed: 0,
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userData?.full_name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your profile.</p>
      </div>

      {userData?.role === "job_seeker" ? (
        <>
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.applications}</div>
                <p className="text-xs text-muted-foreground mt-2">Job applications submitted</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.saved}</div>
                <p className="text-xs text-muted-foreground mt-2">Jobs bookmarked for later</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {userData?.bio && userData?.avatar_url ? "100" : "50"}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Complete your profile to improve visibility</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Browse Jobs</CardTitle>
                <CardDescription>Find opportunities that match your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/jobs">Start Searching</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>Add more details to increase your visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Post a Job</CardTitle>
                <CardDescription>Create a new job listing to find candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dashboard/jobs/create">Post Job</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>View Applicants</CardTitle>
                <CardDescription>Manage and review job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/dashboard/applicants">View All</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
