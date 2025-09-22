"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface Advertisement {
  id: number
  title: string
  image: string
  description: string
}

export function AdvertisementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { translations } = useLanguage()

  const advertisements: Advertisement[] = [
    {
      id: 1,
      title: translations.ads?.fertilizer || "Premium Fertilizers",
      image: "/fertilizer-bags-in-agricultural-field-with-green-c.jpg",
      description: translations.ads?.fertilizerDesc || "Best quality fertilizers for better crop yield",
    },
    {
      id: 2,
      title: translations.ads?.seeds || "Quality Seeds",
      image: "/various-crop-seeds-packets-with-wheat-rice-cotton-.jpg",
      description: translations.ads?.seedsDesc || "High yield variety seeds available",
    },
    {
      id: 3,
      title: translations.ads?.equipment || "Farm Equipment",
      image: "/modern-farming-tractor-equipment-in-agricultural-f.jpg",
      description: translations.ads?.equipmentDesc || "Modern farming equipment for rent",
    },
    {
      id: 4,
      title: translations.ads?.insurance || "Crop Insurance",
      image: "/farmer-with-crops-insurance-protection-concept-gre.jpg",
      description: translations.ads?.insuranceDesc || "Protect your crops with insurance",
    },
  ]

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(timer)
  }, [advertisements.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? advertisements.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === advertisements.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-lg">
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {advertisements.map((ad) => (
          <div key={ad.id} className="w-full flex-shrink-0 relative">
            <Card className="h-full overflow-hidden">
              <div className="relative h-full bg-gray-800">
                <img
                  src={ad.image || "/placeholder.svg"}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/agricultural-farming-concept.jpg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3
                    className="text-lg font-bold mb-1 drop-shadow-lg text-balance"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9)" }}
                  >
                    {ad.title}
                  </h3>
                  <p
                    className="text-sm opacity-95 drop-shadow-md text-pretty"
                    style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.9)" }}
                  >
                    {ad.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 backdrop-blur-sm border border-white/20"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 backdrop-blur-sm border border-white/20"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 border border-white/30 ${
              index === currentIndex ? "bg-white shadow-lg" : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
