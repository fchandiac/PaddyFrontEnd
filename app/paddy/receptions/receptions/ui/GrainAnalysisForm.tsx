"use client";

import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

export default function GrainAnalysisForm() {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Análisis de Granos
      </Typography>
      
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Componente de análisis de granos
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          En desarrollo - Se mostrará aquí el formulario de parámetros de granos
        </Typography>
      </Box>
    </Paper>
  );
}
