"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateJobPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userCompany, setUserCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "Full-time",
    salary_min: "",
    salary_max: "",
    currency: "INR",
    skills: "",
  });
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    try {
      // Get user's company
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("recruiter_id", user.id)
        .single();

      if (!companyData) {
        alert("Please set up your company profile first");
        router.push("/dashboard/company");
        return;
      }

      const { error } = await supabase.from("jobs").insert({
        company_id: companyData.id,
        recruiter_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        job_type: formData.job_type,
        salary_min: formData.salary_min
          ? Number.parseInt(formData.salary_min)
          : null,
        salary_max: formData.salary_max
          ? Number.parseInt(formData.salary_max)
          : null,
        currency: formData.currency,
        skills_required: formData.skills.split(",").map((s) => s.trim()),
        status: "open",
      });

      if (error) throw error;

      router.push("/dashboard/jobs");
      router.refresh();
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Failed to create job posting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href="/dashboard/jobs"
          className="text-primary hover:underline text-sm font-medium inline-block mb-4"
        >
          ← Back to Jobs
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Post a New Job
        </h1>
        <p className="text-muted-foreground">
          Create a job listing to find the perfect candidate
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="Senior Product Designer"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">Job Description *</Label>
              <textarea
                id="description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="job_type">Job Type *</Label>
                <select
                  id="job_type"
                  value={formData.job_type}
                  onChange={(e) =>
                    setFormData({ ...formData, job_type: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="salary_min">Salary Min</Label>
                <Input
                  id="salary_min"
                  type="number"
                  placeholder="50000"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="salary_max">Salary Max</Label>
                <Input
                  id="salary_max"
                  type="number"
                  placeholder="120000"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="skills">Required Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Figma, User Research"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-3">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing Job...
                  </>
                ) : (
                  "Publish Job"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
