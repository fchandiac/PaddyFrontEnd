"use client";

import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

export default function SummaryData() {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Resumen de Recepción
      </Typography>
      
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Resumen de datos de la recepción
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          En desarrollo - Se mostrará aquí el resumen de pesos y cálculos
        </Typography>
      </Box>
    </Paper>
  );
}
