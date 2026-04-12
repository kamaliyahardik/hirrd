"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Users, Briefcase, FileText, BarChart, PieChart, Download, Printer, ShieldCheck, Activity } from "lucide-react"
import Link from "next/link"

interface ReportData {
  totalUsers: number
  recruiters: number
  jobSeekers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  dailyApplications: number[]
}

export default function AdminReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reportDate] = useState(new Date().toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }))
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/admin/login")
        return
      }

      const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()
      if (userData?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      const [
        { count: userCount },
        { count: recruiterCount },
        { count: jobSeekerCount },
        { count: jobCount },
        { count: activeJobCount },
        { count: appCount },
        { data: lastApps }
      ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "recruiter"),
        supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "job_seeker"),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("applications").select("*", { count: "exact", head: true }),
        supabase.from("applications").select("created_at").gt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      const dailyApplications = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        d.setDate(d.getDate() - (6 - i))
        const nextDay = new Date(d)
        nextDay.setDate(d.getDate() + 1)
        
        return lastApps?.filter(app => {
          const appDate = new Date(app.created_at)
          return appDate >= d && appDate < nextDay
        }).length || 0
      })

      setData({
        totalUsers: userCount || 0,
        recruiters: recruiterCount || 0,
        jobSeekers: jobSeekerCount || 0,
        totalJobs: jobCount || 0,
        activeJobs: activeJobCount || 0,
        totalApplications: appCount || 0,
        dailyApplications
      })
      setIsLoading(false)
    }

    fetchData()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto bg-background print:bg-white print:p-0">
      {/* CSS for Print Hiding */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .card {
            border: 1px solid #eee !important;
            box-shadow: none !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Navigation - Hidden in Print */}
      <div className="no-print mb-8 flex justify-between items-center">
        <div>
          <Link href="/admin" className="text-primary hover:underline text-sm font-medium inline-block mb-2">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Platform Intelligence</h1>
          <p className="text-muted-foreground">Strategic analytics and system health</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2 shadow-sm">
            <Printer className="w-4 h-4" />
            Print Report
          </Button>
          <Button onClick={() => window.print()} className="flex items-center gap-2 shadow-md">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Header - Visible only in Print */}
      <div className="print-only mb-10 border-b pb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Hirrd Platform Report</h1>
            <p className="text-slate-500 mt-1">Confidential System Analytics Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Report Generated</p>
            <p className="text-sm text-slate-500">{reportDate}</p>
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: data?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Jobs', value: data?.activeJobs, icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Applications', value: data?.totalApplications, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Recruiters', value: data?.recruiters, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((stat, i) => (
          <Card key={i} className="border-border/60 shadow-sm overflow-hidden card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* User Breakdown Card */}
        <Card className="border-border/60 shadow-sm card">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Audience Composition
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Job Seekers</span>
                  <span>{((data?.jobSeekers || 0) / (data?.totalUsers || 1) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${(data?.jobSeekers || 0) / (data?.totalUsers || 1) * 100}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Recruiters</span>
                  <span>{((data?.recruiters || 0) / (data?.totalUsers || 1) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${(data?.recruiters || 0) / (data?.totalUsers || 1) * 100}%` }} />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-center">
                  <p className="text-2xl font-bold text-blue-700">{data?.jobSeekers}</p>
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-tight">Job Seekers</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50/50 border border-purple-100 text-center">
                  <p className="text-2xl font-bold text-purple-700">{data?.recruiters}</p>
                  <p className="text-xs text-purple-600 font-medium uppercase tracking-tight">Recruiters</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Chart Card */}
        <Card className="border-border/60 shadow-sm card">
          <CardHeader className="border-b border-border/40 bg-muted/20">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Application Engagement (7D)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[220px] flex items-end justify-between gap-3 px-2">
              {(data?.dailyApplications || []).map((count, i) => {
                const max = Math.max(...(data?.dailyApplications || [1]), 1)
                const height = (count / max) * 100
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                    <div className="absolute -top-10 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold">
                      {count} apps
                    </div>
                    <div 
                      className="w-full bg-primary/20 hover:bg-primary/50 transition-all duration-500 rounded-t-md relative" 
                      style={{ height: `${Math.max(height, 8)}%` }} 
                    />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      {new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Summary Section - Hidden in Print (Optional, keeping key info) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border/60 shadow-sm card">
          <CardContent className="p-6">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Conversion Efficiency</h4>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-primary">{((data?.activeJobs || 0) / (data?.totalJobs || 1) * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Percentage of job listings currently active on the platform.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm card">
          <CardContent className="p-6">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Talent Density</h4>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-blue-600">{( (data?.jobSeekers || 0) / (data?.recruiters || 1) ).toFixed(1)}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Ratio of job seekers to recruiters. Indicates market competitiveness.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm card">
          <CardContent className="p-6">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Application Velocity</h4>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-black text-purple-600">{( (data?.totalApplications || 0) / (data?.totalJobs || 1) ).toFixed(1)}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">Average applications per job listing across the entire platform.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Footer - Visible only in Print */}
      <div className="print-only mt-12 pt-8 border-t text-center text-slate-400 text-xs">
        <p>© {new Date().getFullYear()} Hirrd. This document is automatically generated and contains confidential information.</p>
        <p className="mt-1">Authorized for Administrative Use Only.</p>
      </div>

      {/* Quick Summary Box - Hidden in Print */}
      <div className="no-print mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <div>
            <p className="text-sm font-bold text-primary">System Status: Operational</p>
            <p className="text-xs text-muted-foreground">All data is real-time and synchronized with Supabase PostgreSQL.</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic">Last Sync: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
