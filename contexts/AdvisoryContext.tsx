// roahn-b/final-project/Final-project-master/contexts/AdvisoryContext.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context"; // ADDED
import { supabase } from "@/lib/supabaseClient"; // ADDED

// Define the shape of a single notification
interface Notification {
  id: number;
  title: string;
  description: string;
  type: "weather" | "market"; // The allowed types
  read: boolean;
}

// Define the shape of soil report data
interface SoilReport {
  ph: number;
  ec: number;
  oc: number;
  n: number;
  p: number;
  k: number;
  s: number;
  ca: number;
  mg: number;
  zn: number;
  b: number;
  fe: number;
  mn: number;
  cu: number;
  timestamp: number;
}

// Define the shape of your context data
interface AdvisoryContextType {
  advisories: { title: string; description: string; priority: string; time: string }[];
  addAdvisory: (newAdvisory: { title: string; description: string; priority: string; time: string }) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  latestSoilReport: SoilReport | null;
  setLatestSoilReport: (report: SoilReport | null) => void;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

// MODIFIED: Explicitly type the array to prevent type inference issues.
const sampleNotifications: Omit<Notification, "id" | "read">[] = [
    { title: "High Winds Alert", description: "Strong winds expected tomorrow morning. Secure young plants.", type: "weather" },
    { title: "Cotton Prices Up", description: "Cotton prices have increased by 3% in the Mumbai market.", type: "market" },
    { title: "Rainfall Warning", description: "Heavy rainfall predicted for the next 48 hours.", type: "weather" },
    { title: "Onion Market Alert", description: "Onion prices are expected to rise due to high demand.", type: "market" },
];

export function AdvisoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // MODIFIED: Get user from AuthContext
  const [advisories, setAdvisories] = useState([
    // Initial data for the advisories, you can fetch this from an API
    { title: "Pest Infestation Alert", description: "Monitor your crops for whitefly and aphids.", priority: "high", time: "2 hours ago" },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestSoilReport, setLatestSoilReport] = useState<SoilReport | null>(null);

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

  // NEW EFFECT: Load latest soil report on user change/login
  useEffect(() => {
    async function fetchLatestSoilReport() {
      if (!user?.id) {
        setLatestSoilReport(null);
        return;
      }

      console.log(`Fetching latest soil report for user: ${user.id}`);
      
      const { data, error } = await supabase
        .from('soil_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) 
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means "No rows found"
        console.error("Error fetching latest soil report:", error);
        return;
      }

      if (data) {
        // Map database response to frontend interface
        const mappedReport: SoilReport = {
          ph: data.ph,
          ec: data.ec,
          oc: data.oc,
          n: data.n,
          p: data.p,
          k: data.k,
          s: data.s,
          ca: data.ca,
          mg: data.mg,
          zn: data.zn,
          b: data.b,
          fe: data.fe,
          mn: data.mn,
          cu: data.cu,
          // Assuming the Supabase table has a 'created_at' column to indicate when the report was saved
          timestamp: new Date(data.created_at || Date.now()).getTime(),
        };
        setLatestSoilReport(mappedReport);
        console.log("Successfully loaded latest soil report.");
      } else {
         setLatestSoilReport(null);
      }
    }

    fetchLatestSoilReport();
  }, [user]); // Runs when the component mounts and whenever the user object changes (i.e., on login/logout)


  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      addNotification(newNotification);
    }, 200000); // 2 minutes

    return () => clearInterval(interval);
  }, []);


  return (
    <AdvisoryContext.Provider value={{ advisories, addAdvisory, notifications, addNotification, markAsRead, markAllAsRead, latestSoilReport, setLatestSoilReport }}>
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