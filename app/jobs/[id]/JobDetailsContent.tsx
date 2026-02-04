"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Loader2,
  BookmarkIcon,
  Share2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Navbar from "@/components/Home/Navbar";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  skills_required: string[];
  views_count: number;
  created_at: string;
  expires_at?: string;
  companies?: { name: string; logo_url?: string };
}

interface Application {
  id: string;
  status: string;
}

interface JobDetailsContentProps {
  job: Job;
}

export default function JobDetailsContent({ job }: JobDetailsContentProps) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("full_name")
          .eq("id", user.id)
          .single();
        setCurrentUser({ ...user, full_name: userData?.full_name });

        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("resume_url")
          .eq("id", user.id)
          .single();

        setUserProfile(profileData);
        if (profileData?.resume_url) {
          setResumeUrl(profileData.resume_url);
        }

        // Check if user has already applied
        const { data: appData } = await supabase
          .from("applications")
          .select("*")
          .eq("job_id", job.id)
          .eq("applicant_id", user.id)
          .single();

        if (appData) {
          setApplication(appData);
        }

        // Check if job is saved
        const { data: savedData } = await supabase
          .from("saved_jobs")
          .select("*")
          .eq("job_id", job.id)
          .eq("user_id", user.id)
          .single();

        if (savedData) {
          setIsSaved(true);
        }
      } else {
        setCurrentUser(null);
      }

      setIsLoadingUser(false);
    };

    fetchData();
  }, [job.id, supabase]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsUploadingResume(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);

      setResumeUrl(publicUrl);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Error uploading resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    if (!resumeUrl) {
      alert("Please upload a resume or select one from your profile");
      return;
    }

    setIsApplying(true);

    try {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          job_id: job.id,
          applicant_id: currentUser.id,
          status: "applied",
          cover_letter: coverLetter || null,
          resume_url: resumeUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state immediately
      setApplication(data);

      // Show success notification
      toast.success("Application submitted successfully!");

      // Refresh to ensure data consistency
      router.refresh();
      setShowApplicationForm(false);
      setCoverLetter("");
    } catch (error) {
      console.error("Error applying:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }

    setIsSaving(true);

    try {
      if (isSaved) {
        await supabase
          .from("saved_jobs")
          .delete()
          .eq("job_id", job.id)
          .eq("user_id", currentUser.id);

        setIsSaved(false);
      } else {
        await supabase.from("saved_jobs").insert({
          job_id: job.id,
          user_id: currentUser.id,
        });

        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const statusColors = {
    applied: "bg-blue-50 border-blue-200 text-blue-800",
    viewed: "bg-yellow-50 border-yellow-200 text-yellow-800",
    shortlisted: "bg-green-50 border-green-200 text-green-800",
    rejected: "bg-red-50 border-red-200 text-red-800",
    hired: "bg-purple-50 border-purple-200 text-purple-800",
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8 pt-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/jobs"
            className="text-primary hover:underline text-sm font-medium mb-6 inline-block"
          >
            ← Back to Jobs
          </Link>

          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {job.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {job.companies?.name || "Company"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSaveJob}
                  disabled={isSaving}
                  className="bg-transparent"
                >
                  <BookmarkIcon
                    className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Application Status */}
            {application && (
              <div
                className={`p-4 rounded-lg border ${
                  statusColors[application.status as keyof typeof statusColors]
                }`}
              >
                <div className="flex items-center gap-2">
                  {application.status === "shortlisted" ||
                  application.status === "hired" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="font-medium capitalize">
                    {application.status === "shortlisted"
                      ? "You've been shortlisted for this position!"
                      : application.status === "hired"
                        ? "Congratulations! You are hired!"
                        : `You ${
                            application.status === "applied"
                              ? "applied"
                              : "were " + application.status
                          } for this job`}
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
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-medium text-foreground">
                          {job.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Job Type
                        </p>
                        <p className="font-medium text-foreground">
                          {job.job_type}
                        </p>
                      </div>
                    </div>

                    {job.salary_min && (
                      <div className="flex items-center gap-3">
                        <IndianRupee className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Salary Range
                          </p>
                          <p className="font-medium text-foreground">
                            {job.salary_min.toLocaleString()} -{" "}
                            {job.salary_max?.toLocaleString()}
                            {/* {job.currency} */}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Posted</p>
                        <p className="font-medium text-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </p>
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
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {job.description}
                    </p>
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
                    <CardTitle className="text-lg">
                      Application Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div
                        className={`p-3 rounded-lg border ${
                          statusColors[
                            application.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        <p className="font-medium capitalize">
                          {application.status}
                        </p>
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
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full h-11 mb-4"
                    >
                      Apply Now
                    </Button>
                  ) : (
                    <Card className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Submit Application
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">
                            Resume
                          </label>
                          <div className="space-y-3">
                            {resumeUrl && (
                              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm truncate flex-1">
                                  Resume attached
                                </span>
                                <a
                                  href={resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-primary hover:underline"
                                >
                                  View
                                </a>
                              </div>
                            )}

                            <div className="relative">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeUpload}
                                disabled={isUploadingResume || isApplying}
                                className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20"
                              />
                              {isUploadingResume && (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                </div>
                              )}
                            </div>
                            {userProfile?.resume_url && !resumeUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setResumeUrl(userProfile.resume_url)
                                }
                                type="button"
                              >
                                Use Profile Resume
                              </Button>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground block mb-2">
                            Cover Letter
                          </label>
                          <textarea
                            placeholder="Tell the recruiter why you're a great fit for this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            disabled={isApplying}
                          />
                        </div>

                        <div className="space-y-2">
                          <Button
                            onClick={handleApply}
                            disabled={isApplying}
                            className="w-full h-10"
                          >
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
    </>
  );
}
