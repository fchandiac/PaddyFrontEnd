"use client";

import React from "react";
import { Box, Typography, Alert, List, ListItem, ListItemText } from "@mui/material";
import { useReceptionContext } from "@/context/ReceptionDataContext";

export default function ErrorSummary() {
  const { liveClusters } = useReceptionContext();

  // Traducción de mensajes de error
  const translateErrorMessage = (message: string): string => {
    const translations: { [key: string]: string } = {
      "Tolerance cannot be negative": "La tolerancia no puede ser negativa",
      "Tolerance cannot exceed 100%": "La tolerancia no puede exceder 100%",
      "Tolerance cannot exceed percentage": "La tolerancia no puede exceder el porcentaje",
      "Percentage cannot exceed 100%": "El porcentaje no puede exceder 100%",
      "Bonus cannot make Paddy Net exceed Net Weight": "El bonus no puede hacer que el Paddy Neto exceda el Peso Neto",
      "Bonus cannot equal total discounts": "El bonus no puede ser igual al total de descuentos",
      "Total tolerance cannot exceed 100%": "La tolerancia total no puede exceder 100%"
    };
    return translations[message] || message;
  };

  // Recolectar todos los errores de todos los nodos
  const collectErrors = (): { clusterName: string; message: string }[] => {
    const allErrors: { clusterName: string; message: string }[] = [];

    // Función helper para verificar nodos con errores
    const checkNodeErrors = (cluster: any, clusterName: string) => {
      if (cluster.percent?.error && cluster.percent?.errorMessage) {
        allErrors.push({
          clusterName,
          message: translateErrorMessage(cluster.percent.errorMessage)
        });
      }
      if (cluster.tolerance?.error && cluster.tolerance?.errorMessage) {
        allErrors.push({
          clusterName,
          message: translateErrorMessage(cluster.tolerance.errorMessage)
        });
      }
      if (cluster.penalty?.error && cluster.penalty?.errorMessage) {
        allErrors.push({
          clusterName,
          message: translateErrorMessage(cluster.penalty.errorMessage)
        });
      }
      if (cluster.range?.error && cluster.range?.errorMessage) {
        allErrors.push({
          clusterName,
          message: translateErrorMessage(cluster.range.errorMessage)
        });
      }
      if (cluster.node?.error && cluster.node?.errorMessage) {
        allErrors.push({
          clusterName,
          message: translateErrorMessage(cluster.node.errorMessage)
        });
      }
    };

    // Verificar errores en todos los clusters
    Object.entries(liveClusters).forEach(([key, cluster]) => {
      if (cluster && typeof cluster === 'object') {
        checkNodeErrors(cluster, cluster.name || key);
      }
    });

    return allErrors;
  };

  const errors = collectErrors();

  // No mostrar nada si no hay errores
  if (errors.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontSize: '12px' }}>
          Se encontraron {errors.length} error{errors.length > 1 ? 'es' : ''} en el análisis:
        </Typography>
        <List dense sx={{ pt: 0 }}>
          {errors.map((errorItem, index) => (
            <ListItem key={index} sx={{ py: 0, pl: 0 }}>
              <ListItemText 
                primary={
                  <Typography sx={{ fontSize: '12px' }}>
                    <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                      {errorItem.clusterName}
                    </Typography>
                    {': '}
                    {errorItem.message}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Box>
  );
}
