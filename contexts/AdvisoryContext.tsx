// roahn-b/final-project/Final-project-master/contexts/AdvisoryContext.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabaseClient";

interface Notification {
  id: number;
  title: string;
  description: string;
  type: "weather" | "market";
  read: boolean;
}

interface SoilReport {
  ph: number; ec: number; oc: number; n: number; p: number; k: number; s: number;
  ca: number; mg: number; zn: number; b: number; fe: number; mn: number; cu: number;
  timestamp: number;
  card_image_url?: string;
}

interface AdvisoryContextType {
  advisories: { title: string; description: string; priority: string; time: string }[];
  addAdvisory: (newAdvisory: { title: string; description: string; priority: string; time: string }) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "read">) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  latestSoilReport: SoilReport | null;
  allSoilReports: SoilReport[]; // State for all reports
  setLatestSoilReport: (report: SoilReport | null) => void;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

const sampleNotifications: Omit<Notification, "id" | "read">[] = [
    { title: "High Winds Alert", description: "Strong winds expected tomorrow morning. Secure young plants.", type: "weather" },
    { title: "Cotton Prices Up", description: "Cotton prices have increased by 3% in the Mumbai market.", type: "market" },
];

export function AdvisoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [advisories, setAdvisories] = useState([
    { title: "Pest Infestation Alert", description: "Monitor your crops for whitefly and aphids.", priority: "high", time: "2 hours ago" },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestSoilReport, setLatestSoilReport] = useState<SoilReport | null>(null);
  const [allSoilReports, setAllSoilReports] = useState<SoilReport[]>([]); // New state

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
    async function fetchSoilReports() {
      if (!user?.id) {
        setLatestSoilReport(null);
        setAllSoilReports([]);
        return;
      }

      const { data, error } = await supabase
        .from('soil_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching soil reports:", error);
        return;
      }

      if (data) {
        const mappedReports: SoilReport[] = data.map(report => ({
          ph: report.ph, ec: report.ec, oc: report.oc, n: report.n, p: report.p, k: report.k, s: report.s,
          ca: report.ca, mg: report.mg, zn: report.zn, b: report.b, fe: report.fe, mn: report.mn, cu: report.cu,
          timestamp: new Date(report.created_at || Date.now()).getTime(),
          card_image_url: report.card_image_url,
        }));
        
        setAllSoilReports(mappedReports);

        if (mappedReports.length > 0) {
          setLatestSoilReport(mappedReports[0]);
        } else {
          setLatestSoilReport(null);
        }
      }
    }

    fetchSoilReports();
  }, [user]);


  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
      addNotification(newNotification);
    }, 200000); // 2 minutes

    return () => clearInterval(interval);
  }, []);


  return (
    <AdvisoryContext.Provider value={{ advisories, addAdvisory, notifications, addNotification, markAsRead, markAllAsRead, latestSoilReport, allSoilReports, setLatestSoilReport }}>
      {children}
    </AdvisoryContext.Provider>
  );
}

export function useAdvisory() {
  const context = useContext(AdvisoryContext);
  if (context === undefined) {
    throw new Error("useAdvisory must be used within an AdvisoryProvider");
  }
  return context;
}