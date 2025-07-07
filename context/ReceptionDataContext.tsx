'use client';
import React, { createContext, useContext } from "react";
import { useReceptionData } from "../hooks/useReceptionData";
import { Reception, DataReceptionContextType } from "@/types/reception";

const ReceptionDataContext = createContext<ReturnType<typeof useReceptionData> | null>(null);

export const ReceptionDataProvider = ({ children, reception, initialData }: { children: React.ReactNode; reception?: Reception; initialData?: Partial<DataReceptionContextType> }) => {
  const receptionData = useReceptionData({
    ...initialData,
    ...reception,
    riceType: {
      id: reception?.riceType?.id || 0,
      name: reception?.riceType?.name || "",
      description: reception?.riceType?.description || "N/A",
      price: reception?.riceType?.price || 0,
      enable: reception?.riceType?.enable ?? true,
    },
  });
  return (
    <ReceptionDataContext.Provider value={receptionData}>
      {children}
    </ReceptionDataContext.Provider>
  );
};

export const useReceptionContext = () => {
  const context = useContext(ReceptionDataContext);
  if (!context) throw new Error("useReceptionContext must be used within a ReceptionDataProvider");
  return context;
};
