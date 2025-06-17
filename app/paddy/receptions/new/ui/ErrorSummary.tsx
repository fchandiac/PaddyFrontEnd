"use client";

import React from "react";
import { Box, Typography, Alert, List, ListItem, ListItemText } from "@mui/material";
import { useReceptionContext } from "@/context/ReceptionDataContext";

export default function ErrorSummary() {
  const { liveClusters } = useReceptionContext();

  // Recolectar todos los errores de todos los nodos
  const collectErrors = (): string[] => {
    const allErrors: string[] = [];

    // Función helper para verificar nodos con errores
    const checkNodeErrors = (cluster: any, clusterName: string) => {
      if (cluster.percent?.error && cluster.percent?.errorMessage) {
        allErrors.push(`${clusterName}: ${cluster.percent.errorMessage}`);
      }
      if (cluster.tolerance?.error && cluster.tolerance?.errorMessage) {
        allErrors.push(`${clusterName}: ${cluster.tolerance.errorMessage}`);
      }
      if (cluster.penalty?.error && cluster.penalty?.errorMessage) {
        allErrors.push(`${clusterName}: ${cluster.penalty.errorMessage}`);
      }
      if (cluster.range?.error && cluster.range?.errorMessage) {
        allErrors.push(`${clusterName}: ${cluster.range.errorMessage}`);
      }
      if (cluster.node?.error && cluster.node?.errorMessage) {
        allErrors.push(`${clusterName}: ${cluster.node.errorMessage}`);
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
        <Typography variant="subtitle2" gutterBottom>
          Se encontraron {errors.length} error{errors.length > 1 ? 'es' : ''} en el análisis:
        </Typography>
        <List dense sx={{ pt: 0 }}>
          {errors.map((error, index) => (
            <ListItem key={index} sx={{ py: 0, pl: 0 }}>
              <ListItemText 
                primary={error} 
                primaryTypographyProps={{ 
                  variant: 'body2',
                  sx: { fontSize: '0.875rem' }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Box>
  );
}
