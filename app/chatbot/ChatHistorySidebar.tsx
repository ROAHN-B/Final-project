"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

type Chat = {
  id: string;
  title: string;
  timestamp: number;
  messages: any[];
};

interface ChatHistorySidebarProps {
  chatHistory: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  className?: string;
}

export function ChatHistorySidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  className,
}: ChatHistorySidebarProps) {
  
  const formatTimestamp = (ts: number) => {
    if (!ts || isNaN(ts)) return "Invalid date"; 
    return new Intl.DateTimeFormat("en-IN", {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(ts));
  };

  const sortedHistory = [...chatHistory]
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      <div className="p-3 border-b">
        <Button onClick={() => onNewChat()} className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-2">
          {sortedHistory
            .filter(chat => chat && chat.id) 
            .map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full text-left p-2 rounded-md text-sm transition-colors flex flex-col items-start",
                  activeChatId === chat.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <p className="font-semibold truncate">{chat.title}</p>
                <p className={cn("text-xs mt-1", activeChatId === chat.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {formatTimestamp(chat.timestamp)}
                </p>
              </button>
            ))}
        </nav>
      </div>
    </div>
  );
}