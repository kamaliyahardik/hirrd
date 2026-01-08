"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatBox from "@/components/Chat/ChatBox";

interface ApplicationWithJob {
  id: string;
  status: string;
  created_at: string;
  jobs?: {
    id: string;
    title: string;
    location: string;
    recruiter_id: string;
    companies?: { name: string };
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationWithJob | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchApplications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs(id, title, location, recruiter_id, companies(name))")
        .eq("applicant_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
      } else {
        setApplications(data || []);
      }

      setIsLoading(false);
    };

    fetchApplications();
  }, [router, supabase]);

  const statusColors = {
    applied: "bg-blue-100 text-blue-800",
    viewed: "bg-yellow-100 text-yellow-800",
    shortlisted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Applications
        </h1>
        <p className="text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">
              You haven't applied to any jobs yet
            </p>
            <Link
              href="/jobs"
              className="text-primary hover:underline font-medium"
            >
              Browse jobs
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="border-border hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link
                      href={`/jobs/${application.jobs?.id}`}
                      className="block group"
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {application.jobs?.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      {application.jobs?.companies?.name}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {application.jobs?.location}
                      </div>
                      <div>
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <Badge
                      className={`capitalize ${
                        statusColors[
                          application.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {application.status}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={application.status !== "shortlisted"}
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsChatOpen(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] p-0">
          {selectedApplication && currentUserId && selectedApplication.jobs && (
            <ChatBox
              applicationId={selectedApplication.id}
              currentUserId={currentUserId}
              otherUserId={selectedApplication.jobs.recruiter_id}
              otherUserName={
                selectedApplication.jobs.companies?.name || "Recruiter"
              }
              status={selectedApplication.status}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
