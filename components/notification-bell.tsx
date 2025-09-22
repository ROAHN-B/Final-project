"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function NotificationBell() {
  // Dummy notification count for demonstration
  const notificationCount = 3

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" className="p-2">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      {notificationCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
        >
          {notificationCount}
        </Badge>
      )}
    </div>
  )
}
