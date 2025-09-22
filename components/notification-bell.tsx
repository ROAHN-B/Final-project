"use client"

import { Bell, Zap, TrendingUp, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdvisory } from "@/contexts/AdvisoryContext"
import { cn } from "@/lib/utils"

export function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead } = useAdvisory();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-96 glass-effect border-border shadow-lg rounded-2xl">
        <div className="p-3 flex items-center justify-between">
            <DropdownMenuLabel className="text-base font-semibold text-foreground">Notifications</DropdownMenuLabel>
            {unreadCount > 0 && (
                <button onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                    <CheckCheck className="h-3 w-3" />
                    Mark all as read
                </button>
            )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)} className={cn("focus:bg-primary/10 rounded-lg m-1",!notification.read && "bg-secondary/50")}>
                  <div className="flex items-start gap-3 py-2 px-1 w-full">
                    <div className={cn("flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", notification.type === 'weather' ? "bg-blue-100" : "bg-green-100")}>
                      {notification.type === 'weather' ? <Zap className="h-4 w-4 text-blue-500" /> : <TrendingUp className="h-4 w-4 text-green-500" />}
                    </div>
                    <div className="w-full">
                      <p className="font-semibold text-sm text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground text-pretty">{notification.description}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="p-8 text-sm text-muted-foreground text-center">No new notifications</p>
            )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
