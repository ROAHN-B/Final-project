"use client"

import { useLanguage, Language } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LanguageSelector() {
  const { currentLang, setCurrentLang } = useLanguage()

  const languageOptions: { value: Language; label: string }[] = [
    { value: "en", label: "English" },
    { value: "hi", label: "हिंदी" },
    { value: "mr", label: "मराठी" },
    { value: "pa", label: "ਪੰਜਾਬੀ" },
    { value: "kn", label: "ಕನ್ನಡ" },
    { value: "ta", label: "தமிழ்" },
  ]

  return (
    <Select value={currentLang} onValueChange={(value: Language) => setCurrentLang(value)}>
      <SelectTrigger className="w-[120px] h-8 text-xs">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
