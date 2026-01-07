"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function CompanyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
    size: "",
    location: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCompany = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("recruiter_id", user.id)
        .single();

      if (companyData) {
        setCompany(companyData);
        setFormData({
          name: companyData.name,
          description: companyData.description || "",
          website: companyData.website || "",
          industry: companyData.industry || "",
          size: companyData.size || "",
          location: companyData.location || "",
        });
      }

      setIsLoading(false);
    };

    fetchCompany();
  }, [router, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;
    setMessage(null);

    try {
      let error;
      if (company) {
        // Update existing company
        const { error: updateError } = await supabase
          .from("companies")
          .update(formData)
          .eq("id", company.id);
        error = updateError;
      } else {
        // Create new company
        const { error: insertError } = await supabase.from("companies").insert({
          recruiter_id: user.id,
          ...formData,
        });
        error = insertError;
      }

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Company information saved successfully!",
      });
      router.refresh();
    } catch (error: any) {
      console.error("Error saving company:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to save company information",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Company Profile
        </h1>
        <p className="text-muted-foreground">Manage your company information</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`p-4 mb-6 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="Your Company Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isSaving}
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">About Company</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Tell job seekers about your company..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isSaving}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="Technology"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="size">Company Size</Label>
                <select
                  id="size"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  disabled={isSaving}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Company Info"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
