"use client";
import React, { useEffect, useState } from "react";
import ReceptionToPrint from "@/app/paddy/receptions/ReceptionToPrint";
import { getReceptionById } from "@/app/actions/reception";
import { useReceptionContext } from "@/context/ReceptionDataContext";
import { Reception } from "@/types/reception";
import { CircularProgress, Box } from "@mui/material";

interface ReceptionPrintWrapperProps {
  receptionId: string;
}

export default function ReceptionPrintWrapper({ receptionId }: ReceptionPrintWrapperProps) {
  const { setField, setTemplate } = useReceptionContext();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReceptionData = async () => {
      try {
        if (!receptionId || receptionId === "0") return;
        
        setLoading(true);
        const reception = await getReceptionById(parseInt(receptionId));
        
        // Set reception data in context (for specific known fields)
        if (reception) {
          // For known fields, set them directly
          setField('producer', reception.producer);
          setField('riceType', reception.riceType);
          setField('netWeight', reception.netWeight);
          setField('grossWeight', reception.grossWeight);
          setField('price', reception.price);
          // Add any other fields you need to set
        }
      } catch (error) {
        console.error("Error loading reception data for printing:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceptionData();
  }, [receptionId, setField, setTemplate]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return <ReceptionToPrint />;
}
