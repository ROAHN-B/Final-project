// contexts/auth-context.tsx
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Language } from "./language-context"

export interface User {
  id: string
  mobileNumber: string
  firstName: string
  lastName: string
  state: string
  district: string
  taluka: string
  village: string
  language: Language
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
  register: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Use sessionStorage to persist login for the current session
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem("agricultural_app_user")
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      }
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("agricultural_app_user", JSON.stringify(userData))
    }
    router.push("/dashboard")
  }

  const register = (userData: User) => {
    login(userData)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem("agricultural_app_user")
    }
    router.push("/login")
  }

  const updateProfile = (updatedData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedData }
      setUser(updatedUser)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("agricultural_app_user", JSON.stringify(updatedUser))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateProfile, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}