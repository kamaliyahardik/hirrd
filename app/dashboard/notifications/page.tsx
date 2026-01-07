"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Bell } from "lucide-react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
  related_id?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching notifications:", error)
      } else {
        setNotifications(data || [])
      }

      setIsLoading(false)
    }

    fetchNotifications()
  }, [router, supabase])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

    if (unreadIds.length === 0) return

    try {
      await supabase.from("notifications").update({ is_read: true }).in("id", unreadIds)

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead} className="bg-transparent">
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-border cursor-pointer transition-colors ${
                !notification.is_read ? "bg-primary/5" : ""
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-foreground">{notification.title}</h3>
                      {!notification.is_read && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <p className="text-muted-foreground mb-2">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {notification.type.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
