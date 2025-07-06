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
  Paper
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
            <Typography variant="subtitle1" gutterBottom>
              Análisis de Granos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Análisis de granos - En desarrollo
            </Typography>
          </Paper>
        </Grid>

        {/* Resumen - Componente vacío */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Resumen de Recepción
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resumen - En desarrollo
            </Typography>
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
