"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions 
} from "@mui/material";
import { 
  getReceptionById, 
  updateReception 
} from "@/app/actions/reception";
import { useReceptionData } from "@/hooks/useReceptionData";
import { useAlertContext } from "@/context/AlertContext";
import { ReceptionDataProvider, useReceptionContext } from "@/context/ReceptionDataContext";
import { Reception, DataReceptionContextType, ReceptionStatus } from "@/types/reception";
import { TemplateType } from "@/types/discount-template";
import GrainAnalysisForm from "./GrainAnalysisForm";
import SummaryData from "./SummaryData";

interface EditReceptionProps {
  receptionId: number;
  onClose: () => void;
  afterUpdate: () => void;
}

export default function EditReception({ receptionId, onClose, afterUpdate }: EditReceptionProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reception, setReception] = useState<Reception | null>(null);
  const [updateReason, setUpdateReason] = useState("");
  const { showAlert } = useAlertContext();
  
  // Cargar datos de la recepción
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
  
  // Convertir recepción para el hook useReceptionData
  const initialData: Partial<DataReceptionContextType> = reception 
    ? {
        id: reception.id,
        
        producerId: reception.producerId,
        producerName: reception.producer?.name || '',
        producerBusinessName: reception.producer?.businessName || '',
        producerRut: reception.producer?.rut || '',
        producerAddress: reception.producer?.address || '',
        
        riceTypeId: reception.riceTypeId,
        riceTypeName: reception.riceType?.name || '',
        riceTypeDescription: "N/A",
        riceTypePrice: "0",
        riceTypeEnable: true,
        
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
        
        percentGranosManchados: reception.percentGranosManchados,
        toleranceGranosManchados: reception.toleranceGranosManchados,
        
        percentHualcacho: reception.percentHualcacho,
        toleranceHualcacho: reception.toleranceHualcacho,
        
        percentGranosPelados: reception.percentGranosPelados,
        toleranceGranosPelados: reception.toleranceGranosPelados,
        
        percentGranosYesosos: reception.percentGranosYesosos,
        toleranceGranosYesosos: reception.toleranceGranosYesosos,
        
        percentVano: reception.percentVano,
        toleranceVano: reception.toleranceVano,
        
        percentDry: reception.percentSecado,
        
        toleranceBonus: reception.toleranceBonificacion,
        
        // Resultado de cálculos
        totalDiscounts: reception.totalDiscount,
        penaltyBonus: reception.bonus,
        totalPaddy: reception.paddyNet,
        totalToPay: reception.paddyNet * reception.price,
        
        note: reception.note || "",
        status: reception.status,
        createdAt: reception.createdAt,
        updatedAt: reception.updatedAt,
        useToleranceGroup: reception.useToleranceGroup || false,
        
        // Relaciones
        producer: reception.producer || {
          id: 0,
          name: "Sin productor",
          businessName: "",
          rut: "",
          address: ""
        },
        
        riceType: {
          id: reception.riceType?.id || 0,
          name: reception.riceType?.name || "",
          description: "N/A",
          price: "0", 
          enable: true,
        },
        
        // Plantilla por defecto si no existe
        template: {
          id: reception.templateId || 0,
          name: "Sin plantilla",
          useToleranceGroup: false,
          groupToleranceValue: 0,
          producerId: 0,
          availableHumedad: true,
          percentHumedad: 0,
          toleranceHumedad: 0,
          showToleranceHumedad: true,
          groupToleranceHumedad: false,
          availableGranosVerdes: true,
          percentGranosVerdes: 0,
          toleranceGranosVerdes: 0,
          showToleranceGranosVerdes: true,
          groupToleranceGranosVerdes: false,
          availableImpurezas: true,
          percentImpurezas: 0,
          toleranceImpurezas: 0,
          showToleranceImpurezas: true,
          groupToleranceImpurezas: false,
          availableGranosManchados: true,
          percentGranosManchados: 0,
          toleranceGranosManchados: 0,
          showToleranceGranosManchados: true,
          groupToleranceGranosManchados: false,
          availableHualcacho: true,
          percentHualcacho: 0,
          toleranceHualcacho: 0,
          showToleranceHualcacho: true,
          groupToleranceHualcacho: false,
          availableGranosPelados: true,
          percentGranosPelados: 0,
          toleranceGranosPelados: 0,
          showToleranceGranosPelados: true,
          groupToleranceGranosPelados: false,
          availableGranosYesosos: true,
          percentGranosYesosos: 0,
          toleranceGranosYesosos: 0,
          showToleranceGranosYesosos: true,
          groupToleranceGranosYesosos: false,
          availableVano: true,
          percentVano: 0,
          toleranceVano: 0,
          showToleranceVano: true,
          groupToleranceVano: false,
          availableBonus: true,
          toleranceBonus: 0,
          availableDry: true,
          percentDry: 0,
          default: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null
        }
      }
    : {};
  
  const { data, liveClusters, setField } = useReceptionData(initialData);
  
  // Manejar guardado de cambios
  const handleSave = async () => {
    if (!reception) return;
    
    try {
      setSaving(true);
      
      // Preparar payload para actualización
      const updatePayload = {
        price: data.price,
        grossWeight: data.grossWeight,
        tare: data.tare,
        netWeight: data.netWeight,
        
        percentHumedad: data.percentHumedad,
        toleranceHumedad: data.toleranceHumedad,
        
        percentGranosVerdes: data.percentGranosVerdes,
        toleranceGranosVerdes: data.toleranceGranosVerdes,
        
        percentImpurezas: data.percentImpurezas,
        toleranceImpurezas: data.toleranceImpurezas,
        
        percentGranosManchados: data.percentGranosManchados,
        toleranceGranosManchados: data.toleranceGranosManchados,
        
        percentHualcacho: data.percentHualcacho,
        toleranceHualcacho: data.toleranceHualcacho,
        
        percentGranosPelados: data.percentGranosPelados,
        toleranceGranosPelados: data.toleranceGranosPelados,
        
        percentGranosYesosos: data.percentGranosYesosos,
        toleranceGranosYesosos: data.toleranceGranosYesosos,
        
        percentVano: data.percentVano,
        toleranceVano: data.toleranceVano,
        
        percentSecado: data.percentDry,
        
        toleranceBonificacion: data.toleranceBonus,
        
        totalDiscount: data.totalDiscounts,
        bonus: data.penaltyBonus,
        paddyNet: data.totalPaddy,
        
        status: data.status,
        note: data.note
      };
      
      await updateReception(
        receptionId, 
        updatePayload, 
        updateReason || "Actualización de parámetros", 
        "usuario" // Aquí debería ir el nombre de usuario real
      );
      
      showAlert("Recepción actualizada correctamente", "success");
      afterUpdate();
      onClose();
      
    } catch (error) {
      console.error("Error al actualizar la recepción:", error);
      showAlert("Error al actualizar la recepción", "error");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!reception) {
    return (
      <Box p={3}>
        <Typography color="error">
          No se pudo cargar la recepción. Por favor, inténtelo de nuevo.
        </Typography>
      </Box>
    );
  }
  
  return (
    <ReceptionDataProvider reception={reception} initialData={initialData}>
      <EditReceptionContent 
        reception={reception} 
        initialData={initialData} 
        onClose={onClose} 
        afterUpdate={afterUpdate} 
        updateReason={updateReason}
        setUpdateReason={setUpdateReason}
        saving={saving}
        setSaving={setSaving}
      />
    </ReceptionDataProvider>
  );
}

interface EditReceptionContentProps {
  reception: Reception;
  initialData: Partial<DataReceptionContextType>;
  onClose: () => void;
  afterUpdate: () => void;
  updateReason: string;
  setUpdateReason: (reason: string) => void;
  saving: boolean;
  setSaving: (saving: boolean) => void;
}

function EditReceptionContent({ 
  reception, 
  initialData, 
  onClose, 
  afterUpdate, 
  updateReason, 
  setUpdateReason,
  saving,
  setSaving 
}: EditReceptionContentProps) {
  const { data, liveClusters, setField } = useReceptionContext();
  const { showAlert } = useAlertContext();
  
  // Inicializar los datos cuando el componente se monta
  useEffect(() => {
    Object.entries(initialData).forEach(([key, value]) => {
      if (value !== undefined) {
        setField(key as keyof DataReceptionContextType, value);
      }
    });
  }, [initialData, setField]);
  
  // Manejar guardado de cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Preparar payload para actualización
      const updatePayload = {
        price: data.price,
        grossWeight: data.grossWeight,
        tare: data.tare,
        netWeight: data.netWeight,
        
        percentHumedad: data.percentHumedad,
        toleranceHumedad: data.toleranceHumedad,
        
        percentGranosVerdes: data.percentGranosVerdes,
        toleranceGranosVerdes: data.toleranceGranosVerdes,
        
        percentImpurezas: data.percentImpurezas,
        toleranceImpurezas: data.toleranceImpurezas,
        
        percentGranosManchados: data.percentGranosManchados,
        toleranceGranosManchados: data.toleranceGranosManchados,
        
        percentHualcacho: data.percentHualcacho,
        toleranceHualcacho: data.toleranceHualcacho,
        
        percentGranosPelados: data.percentGranosPelados,
        toleranceGranosPelados: data.toleranceGranosPelados,
        
        percentGranosYesosos: data.percentGranosYesosos,
        toleranceGranosYesosos: data.toleranceGranosYesosos,
        
        percentVano: data.percentVano,
        toleranceVano: data.toleranceVano,
        
        percentSecado: data.percentDry,
        
        toleranceBonificacion: data.toleranceBonus,
        
        totalDiscount: data.totalDiscounts,
        bonus: data.penaltyBonus,
        paddyNet: data.totalPaddy,
        
        status: data.status,
        note: data.note
      };
      
      await updateReception(
        reception.id, 
        updatePayload, 
        updateReason || "Actualización de parámetros", 
        "usuario" // Aquí debería ir el nombre de usuario real
      );
      
      showAlert("Recepción actualizada correctamente", "success");
      afterUpdate();
      onClose();
      
    } catch (error) {
      console.error("Error al actualizar la recepción:", error);
      showAlert("Error al actualizar la recepción", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Editar Recepción Nº{reception.id}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Información general - No editable */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Información General
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Productor"
                  value={reception.producer?.name || "Sin productor"}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Tipo de arroz"
                  value={reception.riceType?.name || "Sin tipo"}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Guía"
                  value={reception.guide}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Patente"
                  value={reception.licensePlate}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Fecha"
                  value={new Date(reception.createdAt).toLocaleString()}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="status-label">Estado</InputLabel>
                  <Select
                    labelId="status-label"
                    value={data.status}
                    onChange={(e) => setField('status', e.target.value)}
                    label="Estado"
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
        
        {/* Análisis de granos - Editable */}
        <Grid item xs={12} md={8}>
          <GrainAnalysisForm />
        </Grid>
        
        {/* Resumen y resultados - Actualización automática */}
        <Grid item xs={12} md={4}>
          <SummaryData />
        </Grid>
        
        {/* Nota */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Nota
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={data.note}
              onChange={(e) => setField('note', e.target.value)}
            />
          </Paper>
        </Grid>
        
        {/* Motivo del cambio */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Motivo del cambio
            </Typography>
            <TextField
              fullWidth
              required
              placeholder="Indique el motivo de la modificación"
              value={updateReason}
              onChange={(e) => setUpdateReason(e.target.value)}
            />
          </Paper>
        </Grid>
      </Grid>
      
      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave} 
          disabled={saving || !updateReason}
          startIcon={saving ? <CircularProgress size={20} /> : null}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Box>
    </Box>
  );
}
