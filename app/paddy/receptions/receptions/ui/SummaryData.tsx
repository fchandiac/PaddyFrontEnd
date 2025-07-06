"use client";

import { useReceptionContext } from "@/context/ReceptionDataContext";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";

export default function SummaryData() {
  const { liveClusters, data, setField } = useReceptionContext();
  
  // Función para formatear números con separador de miles y dos decimales
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CL', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(value);
  };
  
  // Función para formatear peso en kg
  const formatWeight = (value: number) => {
    return `${formatNumber(value)} kg`;
  };
  
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        Resumen de Recepción
      </Typography>
      
      {/* Precio - Movido arriba */}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Precio"
            value={data.price}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) || 0;
              setField('price', newValue);
            }}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      {/* Pesos - Sin título */}
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label="Peso Bruto"
            value={liveClusters.grossWeight.node.value}
            onChange={(e) => liveClusters.grossWeight.node.onChange(parseFloat(e.target.value) || 0)}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{ mb: 1 }}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            size="small"
            label="Tara"
            value={liveClusters.tare.node.value}
            onChange={(e) => liveClusters.tare.node.onChange(parseFloat(e.target.value) || 0)}
            onFocus={(e) => (e.target as HTMLInputElement).select()}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{ mb: 1 }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            label="Peso Neto"
            value={liveClusters.netWeight.node.value}
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              readOnly: true,
            }}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
      
      {/* Resultados de cálculos - Sin título */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Total Descuentos"
              value={liveClusters.DiscountTotal.node.value}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                readOnly: true,
              }}
              sx={{ mb: 1 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Bonificación"
              value={liveClusters.Bonus.penalty ? liveClusters.Bonus.penalty.value : 0}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                readOnly: true,
              }}
              sx={{ mb: 1 }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Arroz Paddy Neto"
              value={liveClusters.totalPaddy.node.value}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                readOnly: true,
              }}
              sx={{ 
                mb: 1,
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  "& input": {
                    fontWeight: "bold",
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
