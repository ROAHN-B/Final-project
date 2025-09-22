"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the shape of a single notification
interface Notification {
  id: number;
  title: string;
  description: string;
  type: "weather" | "market";
  read: boolean;
}

// Define the shape of your context data
interface AdvisoryContextType {
  advisories: { title: string; description: string; priority: string; time: string }[];
  addAdvisory: (newAdvisory: { title: string; description: string; priority: string; time: string }) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

const sampleNotifications = [
    { title: "High Winds Alert", description: "Strong winds expected tomorrow morning. Secure young plants.", type: "weather" },
    { title: "Cotton Prices Up", description: "Cotton prices have increased by 3% in the Mumbai market.", type: "market" },
    { title: "Rainfall Warning", description: "Heavy rainfall predicted for the next 48 hours.", type: "weather" },
    { title: "Onion Market Alert", description: "Onion prices are expected to rise due to high demand.", type: "market" },
];

export function AdvisoryProvider({ children }: { children: ReactNode }) {
  const [advisories, setAdvisories] = useState([
    // Initial data for the advisories, you can fetch this from an API
    { title: "Pest Infestation Alert", description: "Monitor your crops for whitefly and aphids.", priority: "high", time: "2 hours ago" },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addAdvisory = (newAdvisory: { title: string; description: string; priority: string; time: string }) => {
    setAdvisories(prevAdvisories => [newAdvisory, ...prevAdvisories]);
  };

  const addNotification = (notification: Omit<Notification, "id" | "read">) => {
    setNotifications(prev => [{ ...notification, id: Date.now(), read: false }, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications([]);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      addNotification(newNotification);
    }, 20000); // 20 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <AdvisoryContext.Provider value={{ advisories, addAdvisory, notifications, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </AdvisoryContext.Provider>
  );
}

// Custom hook for easy access to the context
export function useAdvisory() {
  const context = useContext(AdvisoryContext);
  if (context === undefined) {
    throw new Error("useAdvisory must be used within an AdvisoryProvider");
  }
  return context;
}