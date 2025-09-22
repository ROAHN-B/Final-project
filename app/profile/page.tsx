"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, MapPin, Leaf, Edit, Save, ArrowLeft, Camera, Tractor, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"

function ProfilePageContent() {
  const { translations } = useLanguage()
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const t = translations.profile

  const [userData, setUserData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.mobileNumber || "",
    email: user?.email || "", // Assuming email might come from auth context
    village: user?.village || "",
    district: user?.district || "",
    state: user?.state || "",
    farmSize: user?.farmSize || "",
    cropTypes: user?.cropTypes || "",
    experience: user?.experience || "",
    bio: user?.bio || "",
  })

  // Dummy stats, would come from an API
  const stats = {
    totalQueries: 127,
    cropsDiagnosed: 45,
    advisoriesReceived: 89,
    communityPosts: 23,
  }

  useEffect(() => {
    setIsVisible(true)
    if (user) {
      setUserData({
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        email: user.email || "",
        village: user.village,
        district: user.district,
        state: user.state,
        farmSize: user.farmSize || "",
        cropTypes: user.cropTypes || "",
        experience: user.experience || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleSave = () => {
    if (user) {
      const [firstName, ...lastNameParts] = userData.fullName.split(" ")
      const lastName = lastNameParts.join(" ")

      // Create an updated user profile object
      const updatedUser = {
        ...user,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        mobileNumber: userData.phone,
        village: userData.village,
        district: userData.district,
        state: userData.state,
        farmSize: userData.farmSize,
        cropTypes: userData.cropTypes,
        experience: userData.experience,
        bio: userData.bio,
        email: userData.email,
      };
      
      updateProfile(updatedUser)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (user) {
      // Reset form to original user data
      setUserData({
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.mobileNumber,
        email: user.email || "",
        village: user.village,
        district: user.district,
        state: user.state,
        farmSize: user.farmSize || "",
        cropTypes: user.cropTypes || "",
        experience: user.experience || "",
        bio: user.bio || "",
      })
    }
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto container-padding py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">{t?.title || "My Profile"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing && (
                 <Button variant="outline" size="sm" onClick={handleCancel}>
                    {t?.cancel || "Cancel"}
                </Button>
            )}
            <Button size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              <span className="ml-2">{isEditing ? t?.save || "Save" : t?.edit || "Edit"}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className={`container mx-auto container-padding py-6 space-y-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
        <Card className="glass-effect animate-slide-up">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-2 border-primary/20">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                    {userData.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8" disabled={!isEditing}>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground gradient-text">{userData.fullName}</h2>
                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mt-1">
                  <MapPin className="h-4 w-4" />
                  {userData.village}, {userData.district}
                </p>
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Tractor className="h-3.5 w-3.5" />
                    {userData.experience || "0"} {t?.fields?.yearsUnit || "years"}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Leaf className="h-3.5 w-3.5" />
                    {userData.farmSize || "0"} {t?.fields?.acresUnit || "acres"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> {t?.personalInfo || "Personal Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">{t?.fields?.fullName || "Full Name"}</Label>
                    <Input id="fullName" value={userData.fullName} onChange={(e) => setUserData({ ...userData, fullName: e.target.value })} placeholder={t?.placeholders?.fullName} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">{t?.fields?.phone || "Phone"}</Label>
                    <Input id="phone" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} placeholder={t?.placeholders?.phone} disabled={!isEditing} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="village">{t?.fields?.village || "Village"}</Label>
                    <Input id="village" value={userData.village} onChange={(e) => setUserData({ ...userData, village: e.target.value })} placeholder={t?.placeholders?.village} disabled={!isEditing} />
                </div>
            </CardContent>
          </Card>

          <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Tractor className="h-5 w-5 text-primary" /> {t?.farmInfo || "Farm Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="farmSize">{t?.fields?.farmSize || "Farm Size"}</Label>
                    <Input id="farmSize" value={userData.farmSize} onChange={(e) => setUserData({ ...userData, farmSize: e.target.value })} placeholder={t?.placeholders?.farmSize} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cropTypes">{t?.fields?.cropTypes || "Main Crops"}</Label>
                    <Input id="cropTypes" value={userData.cropTypes} onChange={(e) => setUserData({ ...userData, cropTypes: e.target.value })} placeholder={t?.placeholders?.cropTypes} disabled={!isEditing} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="experience">{t?.fields?.experience || "Experience"}</Label>
                    <Input id="experience" value={userData.experience} onChange={(e) => setUserData({ ...userData, experience: e.target.value })} placeholder={t?.placeholders?.experience} disabled={!isEditing} />
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />{t?.statistics || "My Statistics"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats.totalQueries}</div>
                <div className="text-sm text-muted-foreground">{t?.stats?.totalQueries || "Queries"}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats.cropsDiagnosed}</div>
                <div className="text-sm text-muted-foreground">{t?.stats?.cropsDiagnosed || "Diagnosed"}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats.advisoriesReceived}</div>
                <div className="text-sm text-muted-foreground">{t?.stats?.advisoriesReceived || "Advisories"}</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">{stats.communityPosts}</div>
                <div className="text-sm text-muted-foreground">{t?.stats?.communityPosts || "Posts"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <ProfilePageContent />
}
