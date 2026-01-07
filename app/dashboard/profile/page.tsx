"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    location: "",
    website: "",
    skills: "",
    headline: "",
    experience_years: 0,
  })
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      setUser(userData)
      setProfile(profileData)

      setFormData({
        fullName: userData?.full_name || "",
        bio: userData?.bio || "",
        location: userData?.location || "",
        website: userData?.website || "",
        skills: profileData?.skills?.join(", ") || "",
        headline: profileData?.headline || "",
        experience_years: profileData?.experience_years || 0,
      })

      setIsLoading(false)
    }

    fetchProfile()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return

    try {
      // Update user
      await supabase
        .from("users")
        .update({
          full_name: formData.fullName,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
        })
        .eq("id", authUser.id)

      // Update profile
      await supabase
        .from("profiles")
        .update({
          skills: formData.skills.split(",").map((s) => s.trim()),
          headline: formData.headline,
          experience_years: formData.experience_years,
        })
        .eq("id", authUser.id)

      router.refresh()
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
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
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your public profile and settings</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details to improve job matching</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="e.g., Senior Product Designer"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={isSaving}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                placeholder="React, TypeScript, Tailwind CSS"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: Number.parseInt(e.target.value) })}
                disabled={isSaving}
              />
            </div>

            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
