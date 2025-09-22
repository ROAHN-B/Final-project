"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of your context data
interface AdvisoryContextType {
  advisories: { title: string; description: string; priority: string; time: string }[];
  addAdvisory: (newAdvisory: { title: string; description: string; priority: string; time: string }) => void;
}

const AdvisoryContext = createContext<AdvisoryContextType | undefined>(undefined);

export function AdvisoryProvider({ children }: { children: ReactNode }) {
  const [advisories, setAdvisories] = useState([
    // Initial data for the advisories, you can fetch this from an API
    { title: "Pest Infestation Alert", description: "Monitor your crops for whitefly and aphids.", priority: "high", time: "2 hours ago" },
  ]);

  const addAdvisory = (newAdvisory: { title: string; description: string; priority: string; time: string }) => {
    setAdvisories(prevAdvisories => [newAdvisory, ...prevAdvisories]);
  };

  return (
    <AdvisoryContext.Provider value={{ advisories, addAdvisory }}>
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