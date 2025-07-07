'use client';
import React, { createContext, useContext } from "react";
import { useReceptionData } from "../hooks/useReceptionData";
import { Reception, DataReceptionContextType } from "@/types/reception";

const ReceptionDataContext = createContext<ReturnType<typeof useReceptionData> | null>(null);

export const ReceptionDataProvider = ({ children, reception, initialData }: { children: React.ReactNode; reception?: Reception; initialData?: Partial<DataReceptionContextType> }) => {
  const receptionData = useReceptionData({
    ...initialData,
    // Spread reception data but handle nested objects separately
    ...(reception ? {
      id: reception.id,
      producerId: reception.producerId,
      riceTypeId: reception.riceTypeId,
      templateId: reception.templateId,
      price: reception.price,
      guide: reception.guide,
      licensePlate: reception.licensePlate,
      grossWeight: reception.grossWeight,
      tare: reception.tare,
      netWeight: reception.netWeight,
      percentHumedad: reception.percentHumedad,
      toleranceHumedad: reception.toleranceHumedad,
      percentGranosVerdes: reception.percentGranosVerdes,
      toleranceGranosVerdes: reception.toleranceGranosVerdes,
      percentImpurezas: reception.percentImpurezas,
      toleranceImpurezas: reception.toleranceImpurezas,
      percentVano: reception.percentVano,
      toleranceVano: reception.toleranceVano,
      percentGranosManchados: reception.percentGranosManchados,
      toleranceGranosManchados: reception.toleranceGranosManchados,
      percentHualcacho: reception.percentHualcacho,
      toleranceHualcacho: reception.toleranceHualcacho,
      percentGranosPelados: reception.percentGranosPelados,
      toleranceGranosPelados: reception.toleranceGranosPelados,
      percentGranosYesosos: reception.percentGranosYesosos,
      toleranceGranosYesosos: reception.toleranceGranosYesosos,
      toleranceBonificacion: reception.toleranceBonificacion,
      percentSecado: reception.percentSecado,
      totalDiscount: reception.totalDiscount,
      bonus: reception.bonus,
      paddyNet: reception.paddyNet,
      note: reception.note,
      status: reception.status,
      createdAt: reception.createdAt,
      updatedAt: reception.updatedAt,
      toleranceGroupValue: reception.toleranceGroupValue,
      useToleranceGroup: reception.useToleranceGroup,
    } : {}),
    // Handle riceType safely
    riceType: {
      id: reception?.riceType?.id || 0,
      name: reception?.riceType?.name || "",
      description: "N/A", // Default since Reception doesn't include this
      price: 0, // Default since Reception doesn't include this, will be loaded separately
      enable: true, // Default since Reception doesn't include this
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
