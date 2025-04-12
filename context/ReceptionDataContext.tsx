'use client';
import React, { createContext, useContext } from "react";
import { useReceptionData } from "../hooks/useReceptionData";

const ReceptionDataContext = createContext<ReturnType<typeof useReceptionData> | null>(null);

export const ReceptionDataProvider = ({ children }: { children: React.ReactNode }) => {
  const reception = useReceptionData();
  return (
    <ReceptionDataContext.Provider value={reception}>
      {children}
    </ReceptionDataContext.Provider>
  );
};

export const useReceptionContext = () => {
  const context = useContext(ReceptionDataContext);
  if (!context) throw new Error("useReceptionContext must be used within a ReceptionDataProvider");
  return context;
};
