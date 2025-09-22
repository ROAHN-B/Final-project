"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FloatingActionButtonProps {
  icon: LucideIcon
  onClick: () => void
  className?: string
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
}

export function FloatingActionButton({
  icon: Icon,
  onClick,
  className,
  position = "bottom-right",
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:shadow-lg hover:scale-105 pulse-glow float-animation",
        positionClasses[position],
        className,
      )}
    >
      <Icon className="h-6 w-6" />
    </Button>
  )
}
