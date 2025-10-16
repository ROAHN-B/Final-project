"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2, MoreVertical } from "lucide-react";

// Assuming these are your Shadcn/ui or equivalent component imports
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// --- TYPES ---
type Chat = {
  id: string;
  title: string;
  timestamp: number;
  messages: any[]; // Use 'any[]' since the full Message type is defined in the parent
};

interface ChatHistorySidebarProps {
  chatHistory: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void; // NEW: Handler for deleting a chat
  className?: string;
}
// -------------

export function ChatHistorySidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  className,
}: ChatHistorySidebarProps) {
  
  const formatTimestamp = (ts: number) => {
    if (!ts || isNaN(ts)) return "Invalid date"; 
    // Uses Indian English locale for date formatting
    return new Intl.DateTimeFormat("en-IN", {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(ts));
  };

  // Sort by latest timestamp (most recent first)
  const sortedHistory = [...chatHistory]
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      
      {/* New Chat Button */}
      <div className="p-3 border-b">
        <Button onClick={() => onNewChat()} className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-2">
          {sortedHistory
            .filter(chat => chat && chat.id) 
            .map((chat) => (
              // Wrapper div for the chat item and its context menu
              <div
                key={chat.id}
                className={cn(
                  "relative group w-full p-2 rounded-md text-sm transition-colors flex items-center justify-between",
                  activeChatId === chat.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {/* Main clickable area for selecting the chat */}
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className="flex flex-col items-start flex-1 truncate pr-8" 
                >
                  <p className="font-semibold truncate">{chat.title}</p>
                  <p className={cn(
                    "text-xs mt-1", 
                    activeChatId === chat.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {formatTimestamp(chat.timestamp)}
                  </p>
                </button>

                {/* Dropdown Menu for Delete/Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "absolute right-2 h-7 w-7 transition-opacity",
                        // Always visible on active chat, visible on hover otherwise
                        activeChatId === chat.id 
                          ? "opacity-100 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground" 
                          : "opacity-0 group-hover:opacity-100"
                      )}
                      aria-label="Chat options"
                      // Prevent the button from triggering onSelectChat on the parent button
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="right">
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault(); // Prevent accidental chat selection/navigation
                        onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
}