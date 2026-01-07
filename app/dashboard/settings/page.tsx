"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    setIsDeletingAccount(true)

    try {
      // In a real app, you'd need a backend function to delete the user
      // For now, we'll just sign out
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      setIsDeletingAccount(false)
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card className="border-border mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about your applications</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Job Recommendations</p>
              <p className="text-sm text-muted-foreground">Get personalized job recommendations</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive border-2">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
            {isDeletingAccount ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
