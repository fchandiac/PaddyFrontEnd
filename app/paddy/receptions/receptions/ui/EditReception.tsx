"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment
} from "@mui/material";
import { 
  getReceptionById
} from "@/app/actions/reception";
import { useAlertContext } from "@/context/AlertContext";
import { Reception, ReceptionStatus } from "@/types/reception";

interface EditReceptionProps {
  receptionId: number;
  onClose: () => void;
  afterUpdate: () => void;
}

export default function EditReception({ receptionId, onClose, afterUpdate }: EditReceptionProps) {
  const [loading, setLoading] = useState(true);
  const [reception, setReception] = useState<Reception | null>(null);
  const { showAlert } = useAlertContext();
  
  // Cargar datos de la recepción básicos
  useEffect(() => {
    const fetchReception = async () => {
      try {
        setLoading(true);
        const data = await getReceptionById(receptionId);
        
        // Mostrar toda la respuesta del endpoint
        console.log("=== RESPUESTA COMPLETA DEL ENDPOINT getReceptionById ===");
        console.log("Endpoint:", `${process.env.NEXT_PUBLIC_BACKEND_URL}/receptions/${receptionId}`);
        console.log("Respuesta completa:", JSON.stringify(data, null, 2));
        console.log("Tipo de data:", typeof data);
        console.log("Propiedades de data:", Object.keys(data || {}));
        console.log("=== FIN RESPUESTA ENDPOINT ===");
        
        setReception(data);
      } catch (error) {
        console.error("Error al cargar la recepción:", error);
        showAlert("Error al cargar la recepción", "error");
      } finally {
        setLoading(false);
      }
    };
    
    if (receptionId) {
      fetchReception();
    }
  }, [receptionId, showAlert]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando recepción...
        </Typography>
      </Box>
    );
  }

  if (!reception) {
    return (
      <Box p={4}>
        <Typography variant="h6" color="error">
          No se pudo cargar la recepción
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Editar Recepción Nº{reception.id}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Respuesta del Backend - Para debugging */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              📡 Respuesta del Backend (Endpoint: GET /receptions/{reception.id})
            </Typography>
            <Box sx={{ 
              backgroundColor: "#fff", 
              border: "1px solid #ddd", 
              borderRadius: 1, 
              p: 2,
              maxHeight: 400,
              overflow: "auto"
            }}>
              <Typography 
                variant="body2" 
                component="pre" 
                sx={{ 
                  fontFamily: "monospace", 
                  fontSize: "12px",
                  lineHeight: 1.4,
                  margin: 0,
                  whiteSpace: "pre-wrap"
                }}
              >
                {JSON.stringify(reception, null, 2)}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              Esta sección muestra exactamente lo que responde el backend al llamar al endpoint de obtener recepción por ID.
            </Typography>
          </Paper>
        </Grid>

        {/* Información general - Solo lectura */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Productor"
                  value={reception.producer?.name || "Sin productor"}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.6)",
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tipo de arroz"
                  value={reception.riceType?.name || "Sin tipo"}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.6)",
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Guía"
                  value={reception.guide}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.6)",
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Patente"
                  value={reception.licensePlate}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.6)",
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Fecha"
                  value={new Date(reception.createdAt).toLocaleString()}
                  disabled
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.6)",
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Estado</InputLabel>
                  <Select
                    labelId="status-label"
                    value={reception.status}
                    label="Estado"
                    disabled
                  >
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="settled">Liquidado</MenuItem>
                    <MenuItem value="canceled">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Análisis de granos - Componente vacío */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1">
                Análisis de Granos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plantilla: {reception.template?.name || `Template ID ${reception.templateId}` || "Sin plantilla"}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Análisis de granos - En desarrollo
            </Typography>
          </Paper>
        </Grid>

        {/* Resumen - Campos solicitados */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Resumen de Recepción
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Price */}
              <TextField
                label="Precio"
                type="text"
                fullWidth
                size="small"
                value={
                  reception.price && reception.price > 0
                    ? reception.price.toLocaleString('es-CL', { 
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }) 
                    : '0'
                }
                InputProps={{
                  readOnly: true,
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                  }
                }}
              />

              {/* Gross Weight */}
              <TextField
                label="Peso bruto"
                type="number"
                fullWidth
                size="small"
                value={reception.grossWeight && reception.grossWeight > 0 ? reception.grossWeight : 0}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  sx: { "& input": { textAlign: "right" } },
                }}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                  }
                }}
              />

              {/* Tare */}
              <TextField
                label="Tara"
                type="number"
                fullWidth
                size="small"
                value={reception.tare && reception.tare > 0 ? reception.tare : 0}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  sx: { "& input": { textAlign: "right" } },
                }}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    WebkitTextFillColor: "rgba(0, 0, 0, 0.7)",
                  }
                }}
              />

              {/* Net Weight */}
              <TextField
                label="Peso neto"
                type="number"
                fullWidth
                size="small"
                value={reception.netWeight && reception.netWeight > 0 ? reception.netWeight : 0}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  sx: { "& input": { textAlign: "right" } },
                }}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                sx={{
                  "& .MuiInputBase-input.Mui-readOnly": {
                    WebkitTextFillColor: "#1976d2",
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => {
            showAlert("Funcionalidad en desarrollo", "info");
          }}
        >
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
}
