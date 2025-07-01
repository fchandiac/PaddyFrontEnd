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
  const { setField, setTemplate, liveClusters } = useReceptionContext();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchReceptionData = async () => {
      try {
        if (!receptionId || receptionId === "0") return;
        
        setLoading(true);
        const reception = await getReceptionById(parseInt(receptionId));
        
        // Set reception data in context (for specific known fields)
        if (reception) {
          // Set basic reception data
          setField('id', reception.id);
          setField('producerId', reception.producerId);
          setField('riceTypeId', reception.riceTypeId);
          setField('guide', reception.guide || '');
          setField('licensePlate', reception.licensePlate || '');
          setField('note', reception.note || '');
          setField('status', reception.status);
          setField('createdAt', reception.createdAt);
          setField('updatedAt', reception.updatedAt);
          
          // Set weights and price
          setField('grossWeight', parseFloat(reception.grossWeight?.toString() || '0'));
          setField('tare', parseFloat(reception.tare?.toString() || '0'));
          setField('netWeight', parseFloat(reception.netWeight?.toString() || '0'));
          setField('price', parseFloat(reception.price?.toString() || '0'));
          
          // Set producer data if available
          if (reception.producer) {
            setField('producer', reception.producer);
            setField('producerName', reception.producer.name || '');
            setField('producerBusinessName', reception.producer.businessName || '');
            setField('producerRut', reception.producer.rut || '');
            setField('producerAddress', reception.producer.address || '');
          }
          
          // Set rice type data if available
          if (reception.riceType) {
            setField('riceType', reception.riceType);
            setField('riceTypeName', reception.riceType.name || '');
            // Check if extended riceType properties exist before accessing them
            if ('description' in reception.riceType) {
              setField('riceTypeDescription', (reception.riceType as any).description || '');
            }
            if ('price' in reception.riceType) {
              setField('riceTypePrice', ((reception.riceType as any).price)?.toString() || '');
            }
            if ('enable' in reception.riceType) {
              setField('riceTypeEnable', (reception.riceType as any).enable || false);
            }
          }
          
          // Set grain analysis parameters
          setField('percentHumedad', reception.percentHumedad || 0);
          setField('toleranceHumedad', reception.toleranceHumedad || 0);
          
          setField('percentGranosVerdes', reception.percentGranosVerdes || 0);
          setField('toleranceGranosVerdes', reception.toleranceGranosVerdes || 0);
          
          setField('percentImpurezas', reception.percentImpurezas || 0);
          setField('toleranceImpurezas', reception.toleranceImpurezas || 0);
          
          setField('percentVano', reception.percentVano || 0);
          setField('toleranceVano', reception.toleranceVano || 0);
          
          setField('percentHualcacho', reception.percentHualcacho || 0);
          setField('toleranceHualcacho', reception.toleranceHualcacho || 0);
          
          setField('percentGranosManchados', reception.percentGranosManchados || 0);
          setField('toleranceGranosManchados', reception.toleranceGranosManchados || 0);
          
          setField('percentGranosPelados', reception.percentGranosPelados || 0);
          setField('toleranceGranosPelados', reception.toleranceGranosPelados || 0);
          
          setField('percentGranosYesosos', reception.percentGranosYesosos || 0);
          setField('toleranceGranosYesosos', reception.toleranceGranosYesosos || 0);
          
          // Set bonus and drying parameters
          setField('toleranceBonus', reception.toleranceBonificacion || 0);
          setField('percentDry', reception.percentSecado || 0);
          
          // Set the total to pay
          setField('totalToPay', reception.totalToPay || 0);
          
          // Update liveClusters if needed
          if (liveClusters) {
            try {
              // Update weights
              if (liveClusters.grossWeight?.node) liveClusters.grossWeight.node.value = parseFloat(reception.grossWeight?.toString() || '0');
              if (liveClusters.tare?.node) liveClusters.tare.node.value = parseFloat(reception.tare?.toString() || '0');
              if (liveClusters.netWeight?.node) liveClusters.netWeight.node.value = parseFloat(reception.netWeight?.toString() || '0');
              
              // Update parameters
              if (liveClusters.Humedad?.percent) liveClusters.Humedad.percent.value = reception.percentHumedad || 0;
              if (liveClusters.Humedad?.tolerance) liveClusters.Humedad.tolerance.value = reception.toleranceHumedad || 0;
              
              if (liveClusters.GranosVerdes?.percent) liveClusters.GranosVerdes.percent.value = reception.percentGranosVerdes || 0;
              if (liveClusters.GranosVerdes?.tolerance) liveClusters.GranosVerdes.tolerance.value = reception.toleranceGranosVerdes || 0;
              
              // Force update
              if (liveClusters.totalPaddy?.node) liveClusters.totalPaddy.node.value = reception.totalToPay || 0;
            } catch (err) {
              console.error('Error updating liveClusters:', err);
            }
          }
        }
      } catch (error) {
        console.error("Error loading reception data for printing:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceptionData();
  }, [receptionId, setField, setTemplate, liveClusters]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return <ReceptionToPrint />;
}
