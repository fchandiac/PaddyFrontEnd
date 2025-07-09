"use client";

import { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  CircularProgress,
  Divider,
  Stack,
  Dialog
} from "@mui/material";
import { 
  getReceptionById,
  updateReception
} from "@/app/actions/reception";
import { useAlertContext } from "@/context/AlertContext";
import { Reception, UpdateReceptionPayload } from "@/types/reception";
import { useReceptionDataEdit } from "@/hooks/useReceptionDataEdit";
import { ReceptionDataProvider } from "@/context/ReceptionDataContext";
import { getDefaultTemplate } from "@/app/actions/discount-template";
import ReceptionGeneralData from "../../new/ui/ReceptionGeneralData";
import GrainAnalysis from "../../new/ui/GrainAnalysis";
import ErrorSummary from "../../new/ui/ErrorSummary";
import PrintDialog from "@/components/PrintDialog/PrintDialog";
import ReceptionToPrint from "../../ReceptionToPrint";

interface EditReceptionProps {
  receptionId: number;
  onClose: () => void;
  afterUpdate: () => void;
}

export default function EditReception({ receptionId, onClose, afterUpdate }: EditReceptionProps) {
  return (
    <ReceptionDataProvider>
      <EditReceptionContent 
        receptionId={receptionId}
        onClose={onClose}
        afterUpdate={afterUpdate}
      />
    </ReceptionDataProvider>
  );
}

function EditReceptionContent({ receptionId, onClose, afterUpdate }: EditReceptionProps) {
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [reception, setReception] = useState<Reception | null>(null);
  const [openPrintDialog, setOpenPrintDialog] = useState(false);
  const { showAlert } = useAlertContext();
  
  // Usar el hook de edición con los mismos clusters reactivos que nueva recepción
  const { 
    data, 
    liveClusters, 
    setTemplate, 
    initializeWithReception
  } = useReceptionDataEdit();

  // Función para detectar si hay errores de validación
  const hasValidationErrors = (): boolean => {
    const checkNodeErrors = (cluster: any): boolean => {
      return !!(
        (cluster.percent?.error && cluster.percent?.errorMessage) ||
        (cluster.tolerance?.error && cluster.tolerance?.errorMessage) ||
        (cluster.penalty?.error && cluster.penalty?.errorMessage) ||
        (cluster.range?.error && cluster.range?.errorMessage) ||
        (cluster.node?.error && cluster.node?.errorMessage)
      );
    };

    return Object.values(liveClusters).some(cluster => 
      cluster && typeof cluster === 'object' && checkNodeErrors(cluster)
    );
  };

  // Cargar datos de la recepción y configurar los clusters
  useEffect(() => {
    const fetchReception = async () => {
      try {
        setLoading(true);
        console.log('🔄 DEBUG - Cargando recepción con ID:', receptionId);
        
        const receptionData = await getReceptionById(receptionId);
        console.log('🔄 DEBUG - Datos de recepción recibidos:', receptionData);
        
        setReception(receptionData);
        
        // Cargar plantilla por defecto
        const defaultTemplate = await getDefaultTemplate();
        if (defaultTemplate) {
          setTemplate(defaultTemplate);
        }
        
        // Inicializar los clusters con los datos de la recepción
        initializeWithReception(receptionData);
        
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
  }, [receptionId, showAlert, setTemplate, initializeWithReception]);

  const handleSave = async () => {
    // Verificar si hay errores de validación antes de guardar
    if (hasValidationErrors()) {
      showAlert("Por favor, corrija los errores antes de guardar", "error");
      return;
    }

    // Verificar datos obligatorios
    if (!data.producerId) {
      showAlert("Error: No se puede encontrar el productor", "error");
      return;
    }

    if (!data.riceTypeId) {
      showAlert("Error: No se puede encontrar el tipo de arroz", "error");
      return;
    }

    try {
      setLoadingSave(true);
      
      // Asegurarse que los valores numéricos sean realmente números y no strings o undefined
      const ensureNumber = (value: any): number => {
        if (value === undefined || value === null) return 0;
        const num = Number(value);
        return isNaN(num) ? 0 : num;
      };

      console.log('🔥 DEBUG - Estado completo del contexto antes de actualizar:');
      console.log('data.price:', data.price, 'tipo:', typeof data.price);
      console.log('data.riceTypeId:', data.riceTypeId);
      console.log('data.producerId:', data.producerId);
      console.log('data.template?.id:', data.template?.id);
      console.log('liveClusters estado:', liveClusters);
      
      const payload: UpdateReceptionPayload = {
        producerId: data.producerId,
        riceTypeId: data.riceTypeId,
        templateId: data.template?.id || undefined,
        price: ensureNumber(data.price),
        guide: data.guide || "",
        licensePlate: data.licensePlate || "",
        
        // Pesos - asegurarse que sean números
        grossWeight: ensureNumber(liveClusters.grossWeight.node?.value),
        tare: ensureNumber(liveClusters.tare.node?.value),
        netWeight: ensureNumber(liveClusters.netWeight.node?.value),
        
        // Parámetros - asegurarse que sean números
        percentHumedad: ensureNumber(liveClusters.Humedad.percent?.value),
        toleranceHumedad: ensureNumber(liveClusters.Humedad.tolerance?.value),
        
        percentGranosVerdes: ensureNumber(liveClusters.GranosVerdes.percent?.value),
        toleranceGranosVerdes: ensureNumber(liveClusters.GranosVerdes.tolerance?.value),
        
        percentImpurezas: ensureNumber(liveClusters.Impurezas.percent?.value),
        toleranceImpurezas: ensureNumber(liveClusters.Impurezas.tolerance?.value),
        
        percentVano: ensureNumber(liveClusters.Vano.percent?.value),
        toleranceVano: ensureNumber(liveClusters.Vano.tolerance?.value),
        
        percentHualcacho: ensureNumber(liveClusters.Hualcacho.percent?.value),
        toleranceHualcacho: ensureNumber(liveClusters.Hualcacho.tolerance?.value),
        
        percentGranosManchados: ensureNumber(liveClusters.GranosManchados.percent?.value),
        toleranceGranosManchados: ensureNumber(liveClusters.GranosManchados.tolerance?.value),
        
        percentGranosPelados: ensureNumber(liveClusters.GranosPelados.percent?.value),
        toleranceGranosPelados: ensureNumber(liveClusters.GranosPelados.tolerance?.value),
        
        percentGranosYesosos: ensureNumber(liveClusters.GranosYesosos.percent?.value),
        toleranceGranosYesosos: ensureNumber(liveClusters.GranosYesosos.tolerance?.value),
        
        // Bonificación y secado
        toleranceBonificacion: ensureNumber(liveClusters.Bonus.tolerance?.value),
        percentSecado: ensureNumber(liveClusters.Dry.percent?.value),
        
        // Cálculos derivados (en Kg) - requeridos por el backend
        totalDiscount: ensureNumber(liveClusters.DiscountTotal?.node?.value || 0),
        bonus: ensureNumber(liveClusters.Bonus?.penalty?.value || 0),
        paddyNet: ensureNumber(liveClusters.totalPaddy?.node?.value || 0),
        
        // Nota/observación
        note: data.note || "",
        
        // Mantener el estado original
        status: data.status || "pending"
      };

      console.log('🔥 DEBUG - Payload final que se enviará al backend:');
      console.log('payload completo:', JSON.stringify(payload, null, 2));

      // Llamar a la API para actualizar la recepción
      const result = await updateReception(receptionId, payload);
      
      showAlert("Recepción actualizada correctamente", "success");
      
      // Abrir automáticamente el diálogo de impresión
      setOpenPrintDialog(true);
      
      // Notificar al componente padre que se actualizó
      afterUpdate();
      
    } catch (error) {
      console.error("Error al actualizar la recepción:", error);
      showAlert(`Error al actualizar la recepción: ${error instanceof Error ? error.message : 'Error desconocido'}`, "error");
    } finally {
      setLoadingSave(false);
    }
  };

  const handlePrint = () => {
    setOpenPrintDialog(true);
  };

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
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Editar Recepción Nº{reception.id}
        </Typography>
        
        <Grid container spacing={2} sx={{ minWidth: 0 }}>
          {/* General Data */}
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Datos de la recepción</Typography>
            <ReceptionGeneralData />

            <Divider />
            
            {/* Error Summary - Solo visible cuando hay errores */}
            {hasValidationErrors() && (
              <>
                <Typography gutterBottom sx={{ textAlign: 'right' }}>Errores de validación</Typography>
                <ErrorSummary />
              </>
            )}
          </Grid>

          {/* Grain Analysis */}
          <Grid item xs={12} md={6.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom>Análisis de granos</Typography>
              <Typography gutterBottom>
                Plantilla: {data.template?.name || "Sin plantilla"}
              </Typography>
            </Box>

            <GrainAnalysis />
          </Grid>

          {/* Summary & Actions */}
          <Grid item xs={12} md={2.5}>
            <Typography gutterBottom>Totales</Typography>

            {/* Box resumen con borde redondeado y valores */}
            <Box
              sx={{
                border: "1px solid #1976d2",
                borderRadius: 2,
                p: 2,
                mb: 2,
                background: "#f7fafd",
                overflow: "auto",
                minWidth: 0,
              }}
            >
              <Box component="dl" sx={{ m: 0 }}>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Bruto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.grossWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.grossWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Tara</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.tare.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.tare.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Peso Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.netWeight.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.netWeight.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Total Descuentos</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.DiscountTotal.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.DiscountTotal.node.value} kg`}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Bonificación</Box>
                  <Box component="dd">
                    {liveClusters.Bonus.penalty && !isNaN(liveClusters.Bonus.penalty.value)
                      ? `${liveClusters.Bonus.penalty.value} kg`
                      : "0 kg"}
                  </Box>
                </Box>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box component="dt">Paddy Neto</Box>
                  <Box component="dd">
                    {isNaN(liveClusters.totalPaddy.node.value) 
                      ? '0 kg' 
                      : `${liveClusters.totalPaddy.node.value} kg`}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handlePrint}
                disabled={loadingSave}
              >
                Imprimir
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                disabled={loadingSave || hasValidationErrors()}
              >
                {loadingSave ? (
                  <CircularProgress size={24} />
                ) : (
                  "Actualizar"
                )}
              </Button>
            </Stack>

            <Box mt={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                disabled={loadingSave}
              >
                Cancelar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog para imprimir */}
      <PrintDialog
        open={openPrintDialog}
        setOpen={setOpenPrintDialog}
        title={`Recepción Nº${reception.id}`}
        dialogWidth="md"
      >
        <ReceptionToPrint />
      </PrintDialog>
    </>
  );
}
